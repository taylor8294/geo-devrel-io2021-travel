import {loadMapsApi} from './load-maps-api';
import {MAP_ID, MAPS_API_KEY, MAPS_API_VERSION} from '../config';

import {CameraAnimation, LinearAnimation, OrbitAnimation} from './camera-animation';

export interface BasemapOptions {
  initialViewport: google.maps.CameraOptions;
  libraries?: string;
}

class FlightCameraAnimation extends CameraAnimation {
  update(animationTime: number): void {}
}

/**
 * The basemap combines access to the features needed from the google.maps.Map
 * instance with some additional features for camera-animations. Also handles
 * loading of the maps API and initializing the map itself.
 */
export class Basemap {
  /**
   * A promise that resolves once the maps API finished loading and the map has been initialized.
   */
  public readonly mapReady: Promise<void>;

  /**
   * The container the map will be initialized in.
   */
  private readonly container: HTMLElement;

  /**
   * The map instance.
   */
  private map: google.maps.Map | null = null;

  /**
   * Stores the current camera-parameters.
   */
  private camera: google.maps.CameraOptions = {};

  constructor(container: HTMLElement, mapOptions: BasemapOptions) {
    this.container = container;

    const mapsApiLoaded = loadMapsApi({
      v: MAPS_API_VERSION,
      key: MAPS_API_KEY,
      libraries: mapOptions.libraries
    });

    Object.assign(this.camera, mapOptions.initialViewport);

    this.mapReady = mapsApiLoaded.then(() => this.initMap());
  }

  /**
   * Returns the map-instance. Will throw an exception if called before the map is
   * initialized, so you have to await the mapReady promise.
   */
  public getMapInstance(): google.maps.Map {
    if (!this.map) {
      throw new Error('Basemap.getMapInstance() called before map initialized.');
    }

    return this.map;
  }

  /**
   * Proxy-method for `map.moveCamera()`. Also stores the camera-position to be
   * used as the starting-position for camera-animations.
   */
  public setCamera(camera: google.maps.CameraOptions): void {
    Object.assign(this.camera, camera);

    if (this.map) {
      this.map.moveCamera(this.camera);
    }
  }

  /**
   * Returns the camera-parameters from the map.
   */
  public getCamera(): google.maps.CameraOptions {
    return {
      center: this.map?.getCenter(),
      tilt: this.map?.getTilt(),
      zoom: this.map?.getZoom(),
      heading: this.map?.getHeading()
    };
  }

  /**
   * Syncs the internal state of the camera to values read from the map.
   * This is necessary in some situations for the camera-animations to
   * work properly.
   */
  public syncCamera() {
    Object.assign(this.camera, this.getCamera());
  }

  /**
   * Starts an orbit-anomation around the current camera center-position
   * with the specified rotation-speed.
   * @param degreesPerSecond
   */
  public animateOrbit(degreesPerSecond: number): CameraAnimation {
    const animation = new OrbitAnimation(this);
    animation.initialHeading = this.map!.getHeading()!;
    animation.degreesPerSecond = degreesPerSecond;

    animation.play();

    return animation;
  }

  /**
   * Starts a linear-animation (all properties are linearily interpolated)
   * over the specified properties. Supports an optional easing-function as third
   * argument (see https://easings.net/ for easing functions).
   * @param target
   * @param duration
   * @param easing
   */
  public animateToLinear(
    target: google.maps.CameraOptions,
    duration: number,
    easing: (t: number) => number = t => t
  ): CameraAnimation {
    const animation = new LinearAnimation(this);
    animation.from = {...this.camera};
    animation.to = target;
    animation.duration = duration;
    animation.easing = easing;

    animation.play();

    return animation;
  }

  /**
   * Initializes the map in `this.container`.
   * @return A promise signaling when the map is fully loaded and initial tiles are rendered.
   */
  private initMap(): void {
    const {zoom, center, heading, tilt} = this.camera;
    this.map = new google.maps.Map(this.container, {
      mapId: MAP_ID,
      disableDefaultUI: true,
      backgroundColor: 'transparent',
      gestureHandling: 'greedy',
      zoom,
      center,
      heading,
      tilt
    });

    //@ts-ignore
    window.map = this.map;
  }
}
