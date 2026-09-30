import {
  Camera,
  DirectionalLight,
  HemisphereLight,
  Intersection,
  Matrix4,
  Object3D,
  PerspectiveCamera,
  Raycaster,
  RaycasterParameters,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three';

import distance from '@turf/distance';
import destination from '@turf/destination';

type UpdateFunction = (scene: Scene, camera: Camera) => boolean | void;

const projectionMatrixInverse = new Matrix4();
const raycaster = new Raycaster();
const defaultRaycasterParams = raycaster.params;

export interface RaycastOptions {
  recursive?: boolean;
  raycasterParameters?: RaycasterParameters;
  updateMatrix?: boolean;
}

/**
 * A wrapper for google.maps.WebglOverlayView handling the details of the
 * integration with three.js. This is very similar to the implementation
 * found in `@googlemaps/three`, but has a couple of extra-features.
 */
export default class ThreeJSOverlayView {
  /**
   * The WebglOverlayView instance being used. Aggregation is used instead
   * of extending the class to allow for this class to be parsed before the
   * google-maps API has been loaded.
   * @protected
   */
  protected readonly overlay: google.maps.WebGLOverlayView;

  /**
   * The three.js camera-instance. When interacting with this camera it is
   * important to know that the world-matrix doesn't contain any useful
   * information. Position and orientation of the camera are instead part
   * of the projectionMatrix.
   * @protected
   */
  protected readonly camera: PerspectiveCamera;

  /**
   * The three.js renderer instance. This is initialized in the
   * onContextRestored-callback.
   * @protected
   */
  protected renderer: WebGLRenderer | null;

  /**
   * The three.js Scene instance.
   * @protected
   */
  protected scene: Scene;

  /**
   * The geographic reference-point in latitude/longitude/altitude above ground.
   * @protected
   */
  protected origin: google.maps.LatLngAltitudeLiteral;

  /**
   * Stores the viewport-size for situations where the resolution is needed e.g.
   * for instanced line drawing.
   * @protected
   */
  protected viewportSize: Vector2 = new Vector2();

  /**
   * This callback is called when the overlay has been added to the map, but
   * before it is first rendered.
   */
  public onAdd: (() => void) | null = null;

  /**
   * This callback is called after the overlay has been removed from the map.
   */
  public onRemove: (() => void) | null = null;

  /**
   * This callback is called for every frame being rendered.
   */
  public update: UpdateFunction | null = null;

  /**
   *
   * @param sceneAnchor
   */
  constructor(
    sceneAnchor: google.maps.LatLngAltitudeLiteral | google.maps.LatLngLiteral = {
      lat: 0,
      lng: 0
    }
  ) {
    // setup this class as proxy for the webgl-overlay
    this.overlay = new google.maps.WebGLOverlayView();

    this.overlay.onAdd = wrapExceptionLogger(this.onAdd_.bind(this));
    this.overlay.onRemove = wrapExceptionLogger(this.onRemove_.bind(this));
    this.overlay.onDraw = wrapExceptionLogger(this.onDraw_.bind(this));
    this.overlay.onContextRestored = wrapExceptionLogger(this.onContextRestored_.bind(this));
    this.overlay.onContextLost = wrapExceptionLogger(this.onContextLost_.bind(this));

    this.renderer = null;
    this.scene = new Scene();
    this.origin = {altitude: 0, ...sceneAnchor};
    this.camera = new PerspectiveCamera();

    this.initScene();
  }

  setMap(map: google.maps.Map | null) {
    this.overlay.setMap(map);
  }

  setOrigin(origin: google.maps.LatLngAltitudeLiteral | google.maps.LatLngLiteral) {
    this.origin = {altitude: 0, ...origin};
  }

  getScene() {
    return this.scene;
  }

  getViewportSize() {
    return this.viewportSize;
  }

  requestRedraw() {
    this.overlay.requestRedraw();
  }

  /**
   * Runs raycasting for the specified screen-coordinate against the scene
   * or the optionally specified list of objects.
   * @param normalizedScreenPoint the normalized screen-coordinates, x/y in
   *   range [-1, 1], y pointing up.
   * @param objects optional list of objects to consider, raycasts against the
   *   complete scene if none are specified
   * @param options.recursive set to true to also check children of the specified
   *   objects for intersections. Only applies when a list of objects is
   *   specified.
   * @param options.updateMatrix set this to false to skip updating the
   *   inverse-projection-matrix (useful if you need to run multiple
   *   raycasts for the same frame).
   * @param options.raycasterParameters parameters to pass on to the raycaster
   * @return returns the list of intersections
   */
  raycast(
    normalizedScreenPoint: Vector2,
    objects: Object3D | Object3D[] | null = null,
    options: RaycastOptions = {updateMatrix: true, recursive: false}
  ): Intersection[] {
    let {updateMatrix, recursive, raycasterParameters} = options;

    // the mvp-matrix used to render the previous frame is still stored in
    // this.camera.projectionMatrix so we don't need to recompute it. That
    // matrix would transform meters in our world-space (relative to
    // this.origin) to clip-space/NDC coordinates. The inverse matrix
    // created here does the exact opposite and convert NDC-coordinates to
    // world-space
    if (updateMatrix) {
      projectionMatrixInverse.copy(this.camera.projectionMatrix).invert();
    }

    // to construct the ray, we have to create two points from the mouse-position
    // with different depth. Applying the inverse projection-matrix converts
    // those points into world-space
    raycaster.ray.origin
      .set(normalizedScreenPoint.x, normalizedScreenPoint.y, 0)
      .applyMatrix4(projectionMatrixInverse);

    raycaster.ray.direction
      .set(normalizedScreenPoint.x, normalizedScreenPoint.y, 0.5)
      .applyMatrix4(projectionMatrixInverse)
      .sub(raycaster.ray.origin)
      .normalize();

    if (raycasterParameters) {
      raycaster.params = raycasterParameters;
    }

    if (objects === null) {
      objects = this.scene;
      recursive = true;
    }

    const results = Array.isArray(objects)
      ? raycaster.intersectObjects(objects, recursive)
      : raycaster.intersectObject(objects, recursive);

    raycaster.params = defaultRaycasterParams;

    return results;
  }

  latLngAltToVector2(
    point: google.maps.LatLngAltitudeLiteral | google.maps.LatLngLiteral,
    target: Vector2 = new Vector2()
  ): Vector2 {
    const [dx, dy] = latLngToMetersRelative(point, this.origin);
    return target.set(dx, -dy);
  }

  latLngAltToVector3(
    point: google.maps.LatLngAltitudeLiteral | google.maps.LatLngLiteral,
    target: Vector3 = new Vector3()
  ): Vector3 {
    const [dx, dy] = latLngToMetersRelative(point, this.origin);
    const {altitude = 0} = point as google.maps.LatLngAltitudeLiteral;

    return target.set(dx, altitude, -dy);
  }

  vector3ToLatLngAlt(point: Vector3): google.maps.LatLngAltitudeLiteral {
    const distance = point.length();
    const bearing = getNorthBasedBearing(point);

    const target = destination([this.origin.lng, this.origin.lat], distance, bearing, {
      units: 'meters'
    });

    const coords = target.geometry.coordinates;
    return {
      lat: coords[1],
      lng: coords[0],
      altitude: point.y
    };
  }

  // proxy for the onAdd callback
  onAdd_() {
    if (this.onAdd) {
      this.onAdd();
    }
  }

  // proxy for the onRemove callback
  onRemove_() {
    if (this.onRemove) {
      this.onRemove();
    }
  }

  onContextRestored_(stateOptions: google.maps.WebGLStateOptions) {
    const gl = stateOptions.gl;
    const mapGlCanvas = gl.canvas as HTMLCanvasElement;

    const renderer = new WebGLRenderer({
      canvas: mapGlCanvas,
      context: gl,
      ...gl.getContextAttributes()
    });

    renderer.autoClear = false;
    renderer.autoClearDepth = false;

    const {width, height} = gl.canvas as HTMLCanvasElement;
    this.viewportSize.set(width, height);
    this.renderer = renderer;
  }

  onContextLost_() {
    if (!this.renderer) {
      return;
    }

    this.viewportSize.set(0, 0);
    this.renderer.dispose();
    this.renderer = null;
  }

  onDraw_(drawOptions: google.maps.WebGLDrawOptions) {
    if (!this.scene || !this.renderer) {
      return;
    }

    // fix: this appears to be a bug in the maps-API. onDraw will
    //   continue to be called by the api after it has been removed
    //   from the map. We should be able to remove this once fixed upstream
    if (this.overlay.getMap() === null) {
      return;
    }
    const {gl, transformer} = drawOptions;

    const {lat, lng, altitude} = this.origin;
    this.camera.projectionMatrix.fromArray(
      transformer.fromLatLngAltitude(new google.maps.LatLngAltitude({lat, lng, altitude}))
    );

    const {width, height} = gl.canvas as HTMLCanvasElement;
    this.viewportSize.set(width, height);
    this.renderer.setViewport(0, 0, width, height);

    if (this.update) {
      const res = this.update(this.scene, this.camera);
      if (typeof res === 'undefined' || res) this.overlay.requestRedraw();
    }

    this.renderer.render(this.scene, this.camera);
    this.renderer.resetState();
  }

  private initScene() {
    this.scene = new Scene();

    // rotate the scene so it keeps the y-up orientation used by three.js
    this.scene.rotation.x = Math.PI / 2;

    // create two three.js lights to illuminate the model (roughly approximates
    // the lighting of buildings in maps)
    const hemiLight = new HemisphereLight(0xffffff, 0x444444, 3);
    hemiLight.position.set(0, 1, -0.2).normalize();
    this.scene.add(hemiLight);

    const dirLight = new DirectionalLight(0xffffff);
    dirLight.position.set(0, 100, 10);
    this.scene.add(dirLight);
  }
}

function getNorthBasedBearing(point: Vector3): number {
  const bearingRad = Math.atan2(-point.z, point.x);
  const bearingDeg = (180 * bearingRad) / Math.PI;
  let bearingDegDisplacement = bearingDeg - 90;
  if (bearingDegDisplacement < -180) bearingDegDisplacement += 360;
  return -bearingDegDisplacement;
}

export function latLngToMetersRelative(
  point: google.maps.LatLngLiteral,
  reference: google.maps.LatLngAltitudeLiteral
) {
  const dx = distance([reference.lng, reference.lat], [point.lng, reference.lat], {
    units: 'meters'
  });

  const sx = Math.sign(point.lng - reference.lng);

  const dy = distance([reference.lng, reference.lat], [reference.lng, point.lat], {
    units: 'meters'
  });
  const sy = Math.sign(point.lat - reference.lat);
  return [sx * dx, sy * dy];
}

// (hopefully) temporary solution to make sure exceptions
//   wont be silently ignored.
function wrapExceptionLogger<T extends Function>(fn: T): T {
  return ((...args: any[]) => {
    try {
      return fn(...args);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }) as any;
}
