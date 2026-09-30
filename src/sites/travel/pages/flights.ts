/*
 * This page illustrates animation along a 3 dimensional path and a corresponding
 * camera-animation on a larger scale.
 */

import {CatmullRomCurve3, MathUtils, Object3D, Vector3, Mesh, Color} from 'three';
import {Line2} from 'three/examples/jsm/lines/Line2.js';
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial.js';
import {easeInOutCubic} from '~/src/util/easings';
import IconMarker3d from '~/src/three/icon-marker-3d';
import {Page} from '~/src/core/page';

import cameraPath from '~/dist/static/travel/paths/flight-camera-path.json';
import flightPath from '~/dist/static/travel/paths/flight-path.json';

import PLANE_MODEL_URL from '~/dist/static/travel/models/plane.gltf';
import DEPARTURE_ICON_URL from '~/dist/static/travel/images/departure-icon.svg';
import ARRIVAL_ICON_URL from '~/dist/static/travel/images/arrival-icon.svg';

import {CameraAnimation} from '~/src/map/camera-animation';
import type ThreeJSOverlayView from '~/src/map/threejs-overlay-view';
import type {Basemap} from '~/src/map/basemap';

const ANIMATION_DURATION = 22000;
const ANIMATION_DELAY = 2000;
const PLANE_FRONT = new Vector3(-1, 0, 0);

const THEME_COLOR = 0x285f4;
const MARKER_SIZE = 400;

const INITIAL_CAMEREA = {
  center: {lat: 50.18282186160978, lng: 1.3842773437499998},
  tilt: 30,
  heading: 0,
  zoom: 14
};

const tmpVec3 = new Vector3();

export class FlightsPage extends Page {
  protected originCoordinates = INITIAL_CAMEREA.center;

  private sceneStartTimestamp = 0;
  private departureMarker = new IconMarker3d({
    iconSrc: DEPARTURE_ICON_URL,
    iconSize: MARKER_SIZE,
    color: THEME_COLOR,
    labelHeight: 0,
    baseZoom: INITIAL_CAMEREA.zoom
  });

  private arrivalMarker = new IconMarker3d({
    iconSrc: ARRIVAL_ICON_URL,
    iconSize: MARKER_SIZE,
    color: THEME_COLOR,
    labelHeight: 0,
    baseZoom: INITIAL_CAMEREA.zoom
  });

  private trackLine = new Line2(
    new LineGeometry(),
    new LineMaterial({
      color: THEME_COLOR,
      linewidth: 4,
      vertexColors: false,
      dashed: false
    })
  );

  private planeModel?: Object3D;
  private planeAnimationSpline!: CatmullRomCurve3;
  private cameraAnimation!: FlightTrackingAnimation;

  initialize() {
    const flightPathV3 = flightPath.map(latLngAlt => this.overlay.latLngAltToVector3(latLngAlt));
    this.planeAnimationSpline = new CatmullRomCurve3(flightPathV3);
    this.cameraAnimation = new FlightTrackingAnimation(this.basemap, this.overlay);

    this.initScene();
  }

  start() {
    this.basemap.setCamera(INITIAL_CAMEREA);
    this.sceneStartTimestamp = performance.now();
    this.cameraAnimation.play();
  }

  stop() {
    this.cameraAnimation.pause();
  }

  update() {
    const map = this.basemap.getMapInstance();
    const heading = map.getHeading() || 0;
    const tilt = map.getTilt() || 0;
    const zoom = map.getZoom() || 0;

    // line-shader needs the canvas resolution to compute the line-width
    this.trackLine.material.resolution.copy(this.overlay.getViewportSize());

    // update markers (they will orient towards the camera and adjust
    // size to current zoom)
    this.departureMarker.update({heading, tilt, zoom});
    this.arrivalMarker.update({heading, tilt, zoom});

    if (!this.planeModel) {
      return;
    }

    // compute animation-progress (range [0..1])
    const sceneTime = performance.now() - this.sceneStartTimestamp;
    const animationTime = (sceneTime - ANIMATION_DELAY) % (ANIMATION_DURATION + ANIMATION_DELAY);
    const linearProgress = MathUtils.clamp(animationTime / ANIMATION_DURATION, 0, 1);
    const progress = easeInOutCubic(linearProgress);

    // update position/orientation/scale of the plane-model
    this.planeModel.scale.setScalar(0.2 * Math.pow(1.7, 25 - zoom));
    this.planeAnimationSpline.getPointAt(progress, this.planeModel.position);
    this.planeAnimationSpline.getTangentAt(progress, tmpVec3);
    this.planeModel.quaternion.setFromUnitVectors(PLANE_FRONT, tmpVec3);
  }

  private initScene() {
    const scene = this.overlay.getScene();

    this.initTrackLine(this.planeAnimationSpline);
    this.initMarkers(this.planeAnimationSpline);

    this.loadPlaneModel().then(model => {
      this.planeModel = model;
      scene.add(this.planeModel);

      this.overlay.requestRedraw();
    });
  }

  private async loadPlaneModel(): Promise<Object3D> {
    return new Promise(resolve => {
      const gltfLoader = new GLTFLoader();

      gltfLoader.load(PLANE_MODEL_URL, gltf => {
        gltf.scene.traverse((child) => {
          if (child instanceof Mesh) {
            const materials = Array.isArray(child.material) 
              ? child.material 
              : [child.material];

            materials.forEach((mat) => {
              // Narrow to materials that have a .color property (like MeshStandardMaterial, MeshBasicMaterial, etc.)
              if (mat && 'color' in mat && mat.color instanceof Color) {
                mat.color.convertLinearToSRGB();
              }
            });
          }
        });
        resolve(gltf.scene);
      });
    });
  }

  private initTrackLine(planeAnimationSpline: CatmullRomCurve3) {
    const curvePoints = planeAnimationSpline.getSpacedPoints(
      10 * planeAnimationSpline.points.length
    );

    const positions = new Float32Array(curvePoints.length * 3);
    for (let i = 0; i < curvePoints.length; i++) {
      curvePoints[i].toArray(positions, 3 * i);
    }

    this.trackLine.geometry.setPositions(positions);
    this.trackLine.computeLineDistances();
  }

  private initMarkers(planeAnimationSpline: CatmullRomCurve3) {
    const scene = this.overlay.getScene();

    this.departureMarker.position.copy(planeAnimationSpline.getPointAt(0));
    this.arrivalMarker.position.copy(planeAnimationSpline.getPointAt(1));

    scene.add(this.departureMarker, this.arrivalMarker, this.trackLine);
  }
}

/**
 * The camera-animation is built using the camera-animation class as it needs to use
 * it's own animation-loop.
 */
class FlightTrackingAnimation extends CameraAnimation {
  public delay = ANIMATION_DELAY;
  public duration = ANIMATION_DURATION;
  public zoomAmplitude = 5;

  private overlay: ThreeJSOverlayView;
  private spline: CatmullRomCurve3;

  constructor(basemap: Basemap, overlay: ThreeJSOverlayView) {
    super(basemap);

    this.overlay = overlay;
    this.spline = new CatmullRomCurve3(
      cameraPath.map(latLng => this.overlay.latLngAltToVector3(latLng)),
      false,
      'centripetal',
      0.2
    );
  }

  update(timeSinceStart: number): void {
    const animationTime = (timeSinceStart - this.delay) % (this.duration + this.delay);
    const progress = MathUtils.clamp(animationTime / this.duration, 0, 1);

    const cameraPos = this.spline.getPointAt(easeInOutCubic(progress));
    const {lat, lng} = this.overlay.vector3ToLatLngAlt(cameraPos);

    const zoom = INITIAL_CAMEREA.zoom - this.zoomAmplitude * Math.sin(Math.PI * progress);

    this.basemap.setCamera({
      center: {lat, lng},
      zoom
    });
  }
}
