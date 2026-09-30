import type {Basemap} from '../map/basemap';
import ThreeJSOverlayView from '~/src/map/threejs-overlay-view';

export interface PageConstructor<T extends Page = Page> {
  new (rootEl: HTMLElement, basemap: Basemap): T;
}

/**
 * Base class for the page-controllers. Every page in the demo has one of these.
 * The implementations take care of initializing and updating the contents of the demo,
 * while this base class provides the common interface and handles
 */
export abstract class Page {
  /**
   * The coordinates that will be the origin-point of three.js worldspace coordinates.
   * @protected
   */
  protected abstract originCoordinates: google.maps.LatLngLiteral | google.maps.LatLngAltitudeLiteral;

  /**
   * Allows pages to access the map and camera-animations.
   * @protected
   */
  protected readonly basemap: Basemap;

  /**
   * The html-element with the page-contents. This
   * @protected
   */
  protected readonly rootEl: HTMLElement;

  /**
   * The overlay used for the demo.
   * @protected
   */
  protected overlay: ThreeJSOverlayView;

  private isInitialized: boolean;

  constructor(rootEl: HTMLElement, basemap: Basemap) {
    this.isInitialized = false;
    this.rootEl = rootEl;
    this.basemap = basemap;

    this.overlay = new ThreeJSOverlayView();
    this.overlay.update = () => this.update();
  }

  /**
   * Is called when the map is started for the first time. This method is used to setup the
   * three.js scene, start loading assets and setup.
   */
  initialize(): void {}

  /**
   * Is called when the page is started. This should be used to setup the starting
   * view.
   */
  start() {}

  /**
   * This method is called when the overlay updates (during rendering of the map).
   * Should be overridden to update the scene for animations and interaction.
   * Update is only called when the map-changes. For animations, raycasting,make sure to call
   * this.overlay.requestRedraw() to render a new frame.
   */
  update() {}

  /**
   * Is called when navigating away from this page, before the next page is started.
   * Override this to detach event-handlers from the map.
   */
  stop() {}

  /**
   * Initializes and shows the page and adds it's overlay to the map.
   */
  show() {
    if (!this.isInitialized) {
      this.isInitialized = true;

      this.overlay.setOrigin(this.originCoordinates);
      this.initialize();
    }

    this.overlay.setMap(this.basemap!.getMapInstance());
    this.rootEl.style.display = '';
  }

  /**
   * Hides the page and removes the overlay from the map.
   */
  hide() {
    this.rootEl.style.display = 'none';
    // oobe-pages can be expanded/collapsed
    this.rootEl.removeAttribute('expanded');
    this.overlay.setMap(null);
  }
}
