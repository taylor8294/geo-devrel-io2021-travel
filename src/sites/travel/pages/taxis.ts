import {easeInOutCubic, easeInOutQuad, easeInSine} from '../../../util/easings';

import {CatmullRomCurve3, MathUtils, Mesh, Object3D, Vector3} from 'three';

import {Line2} from 'three/examples/jsm/lines/Line2.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

import DottedDirectionsLine from '../../../three/dotted-directions-line';
import OriginMarker from '../../../three/origin-marker';
import IconMarker3d from '../../../three/icon-marker-3d';
import {Page} from '~/src/core/page';

import CAR_MODEL_URL from '~/dist/static/travel/models/taxi.gltf';
import TAXI_ICON_URL from '~/dist/static/travel/images/taxi-icon.svg';
import ACCOMODATION_ICON_URL from '~/dist/static/travel/images/accomodation-marker-yellow.svg';

import taxiPath from '~/dist/static/travel/paths/taxi-path.json';
import walkingPath from '~/dist/static/travel/paths/taxi-walking-path.json';
import cameraPath from '~/dist/static/travel/paths/taxi-camera-path.json';

import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry.js';
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial.js';
import {CameraAnimation} from '~/src/map/camera-animation';
import type {Basemap} from '~/src/map/basemap';
import type ThreeJSOverlayView from '~/src/map/threejs-overlay-view';

const {lerp, mapLinear, clamp} = MathUtils;

const ANIMATION_DURATION = 40000;
const START_DELAY = 1000;
const CAR_FRONT = new Vector3(1, 0, 0);
const ARC_LENGTH_DIVISIONS = 5000; // keep this high enough to have linear movement
const ACCOMODATION_MARKER_POSITION = {
  lat: 51.507069,
  lng: -0.14162,
  altitude: 32.1
};

const THEME_COLOR = 0xf4b400;

const INITIAL_CAMERA = {
  center: {lat: 51.469777, lng: -0.452026},
  heading: 74,
  tilt: 90,
  zoom: 21
};
const DESTINATION_ZOOM = 18;

const tmpVec3 = new Vector3();

export class TaxisPage extends Page {
  protected originCoordinates = INITIAL_CAMERA.center;

  private startTimestamp = 0;
  private cameraAnimation!: TaxiAnimation;

  private taxiSpline!: CatmullRomCurve3;
  private carModel?: Object3D;

  private hotelMarker = new IconMarker3d({
    iconSrc: ACCOMODATION_ICON_URL,
    iconSize: 12,
    color: THEME_COLOR,
    labelHeight: 10,
    baseZoom: DESTINATION_ZOOM
  });

  private taxiMarker = new IconMarker3d({
    iconSrc: TAXI_ICON_URL,
    iconSize: 4,
    color: THEME_COLOR,
    labelHeight: 0,
    baseZoom: INITIAL_CAMERA.zoom
  });

  private originMarker = new OriginMarker({size: 5, color: THEME_COLOR});

  private taxiLine = new Line2(
    new LineGeometry(),
    new LineMaterial({
      color: THEME_COLOR,
      linewidth: 4,
      vertexColors: false,
      dashed: false
    })
  );

  initialize() {
    this.cameraAnimation = new TaxiAnimation(this.basemap, this.overlay);
    this.taxiSpline = new CatmullRomCurve3(
      taxiPath.map(p => this.overlay.latLngAltToVector3(p)),
      false,
      'centripetal',
      0.2
    );

    this.initScene();
  }

  start() {
    this.basemap.setCamera(INITIAL_CAMERA);

    this.startTimestamp = performance.now();
    this.cameraAnimation.play();
  }

  stop() {
    this.cameraAnimation.pause();
  }

  update() {
    this.taxiLine.material.resolution.copy(this.overlay.getViewportSize());

    const map = this.basemap.getMapInstance();
    const heading = map.getHeading();
    const tilt = map.getTilt();
    const zoom = map.getZoom();

    this.originMarker.update({heading, tilt});
    this.taxiMarker.update({heading, tilt, zoom});
    this.hotelMarker.update({heading, tilt, zoom});

    if (!this.carModel) {
      return;
    }

    this.carModel.scale.setScalar(0.1 * Math.pow(1.7, 25 - (zoom || 0)));

    const sceneTime = performance.now() - this.startTimestamp;
    const linearProgress = clamp((sceneTime - START_DELAY) / ANIMATION_DURATION, 0, 1);

    if (linearProgress === 1) return;

    // car position/rotation
    const progress = easeInOutCubic(linearProgress);

    this.taxiSpline.getPointAt(progress, this.carModel.position);
    this.taxiSpline.getTangentAt(progress, tmpVec3);
    this.carModel.quaternion.setFromUnitVectors(CAR_FRONT, tmpVec3);

    this.overlay.requestRedraw();
  }

  private initScene() {
    const scene = this.overlay.getScene();

    this.loadCarModel().then(model => {
      this.carModel = model;
      scene.add(model);
    });

    this.initTaxiLine();

    this.overlay.latLngAltToVector3(walkingPath[0], this.originMarker.position);
    this.overlay.latLngAltToVector3(walkingPath[walkingPath.length - 1], this.taxiMarker.position);
    this.overlay.latLngAltToVector3(ACCOMODATION_MARKER_POSITION, this.hotelMarker.position);

    scene.add(
      this.createWalkingLine(),
      this.taxiLine,
      this.originMarker,
      this.taxiMarker,
      this.hotelMarker
    );
  }

  private loadCarModel(): Promise<Object3D> {
    const gltfLoader = new GLTFLoader();

    return new Promise(resolve => {
      gltfLoader.load(CAR_MODEL_URL, gltf => {
        const car = gltf.scene;

        // workaround for disappearing models bug
        car.traverse((obj: Object3D) => {
          if ((obj as Mesh).geometry) {
            obj.frustumCulled = false;
          }
        });

        resolve(car);
      });
    });
  }

  private initTaxiLine() {
    // arcLengthDivisions has to be a high value to get more accurate position-interpolation
    // along the spline.
    this.taxiSpline.arcLengthDivisions = ARC_LENGTH_DIVISIONS;
    const taxiCurvePoints = this.taxiSpline.getSpacedPoints(5 * this.taxiSpline.points.length);
    const taxiPositions = new Float32Array(taxiCurvePoints.length * 3);
    for (let i = 0; i < taxiCurvePoints.length; i++) {
      taxiCurvePoints[i].toArray(taxiPositions, 3 * i);
    }

    this.taxiLine.geometry.setPositions(taxiPositions);
    this.taxiLine.computeLineDistances();
  }

  private createWalkingLine() {
    return new DottedDirectionsLine(
      walkingPath.map(p => this.overlay.latLngAltToVector2(p)),
      {
        color: 0xf4b400,
        pointSize: 1,
        pointSpacing: 2
      }
    );
  }
}

/**
 * Camera-Animations should run outside of the overlay update-loop, as updates is called amidst
 * rendering a frame.
 */
class TaxiAnimation extends CameraAnimation {
  public delay = START_DELAY;
  public duration = ANIMATION_DURATION;

  public headingAnimationStart = 0.85;
  public targetHeading = 160;

  public zoomAmplitude = 11.5;
  public targetZoom = DESTINATION_ZOOM;

  private overlay: ThreeJSOverlayView;
  private spline: CatmullRomCurve3;

  constructor(basemap: Basemap, overlay: ThreeJSOverlayView) {
    super(basemap);

    this.overlay = overlay;
    this.spline = new CatmullRomCurve3(
      cameraPath.map(({lat, lng}) => this.overlay.latLngAltToVector3({lat, lng, altitude: 0})),
      false,
      'centripetal',
      0.2
    );
  }

  update(animationTime: number) {
    const linearProgress = MathUtils.clamp((animationTime - this.delay) / this.duration, 0, 1);
    const progress = easeInOutCubic(linearProgress);

    // stop animation once target is reached
    if (linearProgress === 1) this.pause();

    const cameraPos = this.spline.getPointAt(progress);
    const {lat, lng} = this.overlay.vector3ToLatLngAlt(cameraPos);

    // compute a zoom out/zoom in animation and lerp towards the target zoom-level (smoothes out the approach)
    const calcZoom = INITIAL_CAMERA.zoom - this.zoomAmplitude * Math.sin(Math.PI * linearProgress);
    const zoom = lerp(calcZoom, this.targetZoom, easeInSine(linearProgress));

    // the map heading swings around to the final direction starting when animation is 85% complete.
    const headingProgress = clamp(
      mapLinear(linearProgress, this.headingAnimationStart, 1, 0, 1),
      0,
      1
    );
    const heading = lerp(
      INITIAL_CAMERA.heading,
      this.targetHeading,
      easeInOutQuad(headingProgress)
    );

    this.basemap.setCamera({
      center: {lat, lng},
      zoom,
      heading
    });
  }
}
