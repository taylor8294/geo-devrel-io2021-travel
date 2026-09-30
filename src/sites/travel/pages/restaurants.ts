/*
 * This example illustrates how an interactive places-search with walking directions can be
 * implenmented. This includes rendering markers, adding raycasting to be able to click on
 * those markers and loading places details and walking-directions from the places- and
 * directions-services.
 */
import {Group, MathUtils, Object3D, Vector2} from 'three';

import DottedDirectionsLine from '~/src/three/dotted-directions-line';
import {easeInOutQuint} from '~/src/util/easings';

import RESTAURANTS_ICON from '~/dist/static/travel/images/restaurants-icon.svg';
import RESTAURANTS_ICON_INVERTED from '~/dist/static/travel/images/restaurants-icon-inverted.svg';
import RESTAURANTS_ICON_HOVER from '~/dist/static/travel/images/restaurants-icon-hover.svg';
import OriginMarker from '~/src/three/origin-marker';
import IconMarker3d from '~/src/three/icon-marker-3d';
import type {CameraAnimation} from '~/src/map/camera-animation';
import {Page} from '~/src/core/page';
import type TravelRestaurant from '~/src/sites/travel/components/travel-restaurant';

interface Restaurant {
  id: string;
  location: google.maps.LatLngLiteral;
  place: google.maps.places.PlaceResult;
  marker: IconMarker3d;
  directionsLine?: DottedDirectionsLine;
  isHighlighted: boolean;
  isSelected: boolean;
}

const ANIMATION_START_CAMERA = {
  center: {
    lat: 51.506623909832456,
    lng: -0.14201179154832877
  },
  zoom: 17,
  heading: 0,
  tilt: 0
};

const DEFAULT_CAMERA = {
  center: {lat: 51.50663929607001, lng: -0.14198304637023096},
  heading: 41,
  tilt: 67.5,
  zoom: 17
};

// to indicate interactive elements we will swap out the default cursor for the
// browser-default 'pointer'-cursor. In order to switch back we need the
// original cursor and it seems impossible to get this from the map-instance
// otherwise.
const DEFAULT_DRAGGABLE_CURSOR =
  'url("https://maps.gstatic.com/mapfiles/openhand_8_8.cur"), default';

const PERSON_POSITION = {
  lat: 51.50693850015297,
  lng: -0.1423229107977919,
  altitude: 0
};

const SEARCH_RADIUS = 1000;

const MARKER_DEFAULT_STYLE = {
  iconSrc: RESTAURANTS_ICON,
  color: 0xdb4437,
  iconSize: 30,
  baseZoom: DEFAULT_CAMERA.zoom,
  labelHeight: 60
};

const ANIMATION_DURATION = 1500;
const ANIMATION_DELAY = 300;

export class RestaurantsPage extends Page {
  protected originCoordinates = DEFAULT_CAMERA.center;

  private directionsService: google.maps.DirectionsService | null = null;
  private placesService: google.maps.places.PlacesService | null = null;

  private restaurantDetailsEl: TravelRestaurant | null = null;

  private mapListeners: google.maps.MapsEventListener[] = [];
  private originMarker?: OriginMarker;
  private markerContainer: Group = new Group();

  private restaurants: Restaurant[] = [];

  private restaurantsToAdd: Restaurant[] = [];
  private highlightedRestaurant: Restaurant | null = null;
  private selectedRestaurant: Restaurant | null = null;

  private startTime = 0;
  private mousePosition: Vector2 = new Vector2();
  private mapAnimation: CameraAnimation | null = null;

  private delayedAnimationId = 0;

  initialize() {
    this.restaurantDetailsEl = this.rootEl.querySelector('travel-restaurant');

    this.directionsService = new google.maps.DirectionsService();
    this.placesService = new google.maps.places.PlacesService(this.basemap.getMapInstance());

    IconMarker3d.prefetchIcons(RESTAURANTS_ICON, RESTAURANTS_ICON_HOVER, RESTAURANTS_ICON_INVERTED);

    this.initScene();

    this.loadRestaurants().then(restaurants => {
      this.restaurants = restaurants;

      this.initRestaurantMarkers(restaurants);
      this.overlay.requestRedraw();
    });
  }

  start() {
    this.bindMapEvents();
    this.startTime = performance.now();
    this.basemap.setCamera(ANIMATION_START_CAMERA);

    this.delayedAnimationId = window.setTimeout(() => {
      this.delayedAnimationId = 0;
      this.mapAnimation = this.basemap.animateToLinear(
        DEFAULT_CAMERA,
        ANIMATION_DURATION,
        easeInOutQuint
      );
    }, ANIMATION_DELAY);
  }

  update() {
    this.updateRaycaster();

    // to get the cursor:pointer when hovering over markers, we need to trick
    // maps into using a different cursor for the draggable state we're in.
    // @ts-ignore this is broken and doesn't find correct typings for MapOptions
    this.basemap.getMapInstance().setOptions({
      draggableCursor: this.highlightedRestaurant ? 'pointer' : DEFAULT_DRAGGABLE_CURSOR
    });

    const map = this.basemap.getMapInstance();
    const zoom = map.getZoom() || DEFAULT_CAMERA.zoom;
    const heading = map.getHeading() || 0;
    const tilt = map.getTilt() || 0;

    let needsRedraw = false;

    // staggered adding of markers – randomly add markers starting after
    // 2 seconds until all markers have been added.
    if (this.restaurantsToAdd.length > 0) {
      needsRedraw = true;
      if (performance.now() - this.startTime > 1000 && Math.random() > 0.6) {
        const [pickedRestaurant] = this.restaurantsToAdd.splice(
          MathUtils.randInt(0, this.restaurantsToAdd.length - 1),
          1
        );

        this.markerContainer.add(pickedRestaurant.marker);
      }
    }

    // update origin-marker
    if (this.originMarker) {
      this.originMarker.update({heading, tilt, zoom});
    }

    // update marker-styles based on selected/highlighted markers
    for (const restaurant of this.restaurants) {
      const marker = restaurant.marker;
      const markerProps = {...MARKER_DEFAULT_STYLE, zoom, heading, tilt};

      if (!marker) continue;

      if (restaurant.isSelected) {
        markerProps.color = 0xdb4437;
        markerProps.iconSrc = RESTAURANTS_ICON_INVERTED;
        markerProps.labelHeight *= 1.3;
        markerProps.iconSize *= 1.2;
      } else if (restaurant.isHighlighted) {
        markerProps.color = 0xa4332a;
        markerProps.iconSrc = RESTAURANTS_ICON_HOVER;
      }

      marker.update(markerProps);

      // make the walking-directions visible if already loaded
      if (restaurant.directionsLine) {
        restaurant.directionsLine.visible = restaurant.isSelected;
      }
    }

    return needsRedraw;
  }

  stop() {
    this.unbindMapEvents();

    // remove all markers and re-add them to the queue so the animation will
    // run again when started next time
    this.restaurantsToAdd = [...this.restaurants];
    this.markerContainer.children = [];

    // stop/reset animations if they are still running
    if (this.mapAnimation) {
      this.mapAnimation.dispose();
      this.mapAnimation = null;
    }

    if (this.delayedAnimationId) {
      clearTimeout(this.delayedAnimationId);
      this.delayedAnimationId = 0;
    }

    // if there's a marker selected, make sure it will be the initially shown
    // when navigating back to the page.
    if (this.selectedRestaurant) {
      const selectedMarkerIdx = this.restaurantsToAdd.indexOf(this.selectedRestaurant);
      this.restaurantsToAdd.splice(selectedMarkerIdx, 1);
      this.markerContainer.add(this.selectedRestaurant.marker);
    }
  }

  /**
   * Sets up the scene.
   * @return promise that resolves when everything is complete and added
   *   to the scene.
   */
  private initScene() {
    const overlay = this.overlay;
    const scene = overlay.getScene();

    this.originMarker = new OriginMarker({
      size: 40,
      color: MARKER_DEFAULT_STYLE.color
    });
    overlay.latLngAltToVector3(PERSON_POSITION, this.originMarker.position);
    this.originMarker.position.y = 0.2;
    scene.add(this.originMarker);
    scene.add(this.markerContainer);
  }

  /**
   * Loads nearby restaurants from the places-API and creates 3d-icon markers
   * for them.
   */
  private initRestaurantMarkers(restaurants: Restaurant[]) {
    if (restaurants.length === 0) {
      return;
    }

    const selectedRestaurant = restaurants[0];
    this.setSelected(selectedRestaurant);
    this.restaurantsToAdd = [...restaurants];
    this.restaurantsToAdd.splice(this.restaurantsToAdd.indexOf(selectedRestaurant), 1);
    this.markerContainer.add(selectedRestaurant.marker);
  }

  private async loadRestaurants(): Promise<Restaurant[]> {
    const placesResults = await placesNearbySearchAsync(this.placesService!, {
      location: PERSON_POSITION,
      radius: SEARCH_RADIUS,
      type: 'restaurant'
    });

    const restaurants: Restaurant[] = [];
    for (let place of placesResults) {
      // filter out places that don't have all the information we want to show
      if (!place.place_id) continue;
      if (!place.geometry || !place.geometry.location) continue;
      if (!place.photos || place.photos.length === 0) continue;

      const location = place.geometry.location.toJSON();
      const marker = new IconMarker3d({
        iconSrc: RESTAURANTS_ICON,
        iconSize: 35,
        baseZoom: DEFAULT_CAMERA.zoom,
        labelHeight: 60
      });
      marker.userData.placeId = place.place_id;

      this.overlay.latLngAltToVector3(location, marker.position);

      restaurants.push({
        id: place.place_id,
        place,
        location: place.geometry.location.toJSON(),
        isHighlighted: false,
        isSelected: false,
        marker
      });
    }
    return restaurants;
  }

  /**
   * Updates the walking-directions for the specified marker via the
   * directions-API and creates a DottedDirectionsLine from the results.
   */
  private async loadDirectionsForRestaurant(restaurant: Restaurant) {
    // skip this if the directions have already been loaded
    if (restaurant.directionsLine) {
      return;
    }

    const overlay = this.overlay;

    const result = await this.directionsService!.route({
      origin: PERSON_POSITION,
      destination: restaurant.location,
      travelMode: google.maps.TravelMode.WALKING
    });

    if (result === null || result.routes.length === 0) {
      console.warn('no routing result!');
      return;
    }

    const route = result.routes[0].overview_path;
    const directionsLine = new DottedDirectionsLine(
      route.map(ll => overlay.latLngAltToVector2(ll.toJSON())),
      {color: 0xdb4437, opacity: 1, pointSize: 5, pointSpacing: 10}
    );

    directionsLine.visible = false;
    overlay.getScene().add(directionsLine);

    restaurant.directionsLine = directionsLine;
  }

  /**
   * Registers event-handlers for the mousemove and click events.
   */
  private bindMapEvents() {
    const overlay = this.overlay;
    const map = this.basemap.getMapInstance();
    const mapDiv = map.getDiv();

    const updateMousePosition = (ev: google.maps.MapMouseEvent) => {
      const domEvent = ev.domEvent as MouseEvent;
      const mapRect = mapDiv.getBoundingClientRect();

      const x = domEvent.clientX - mapRect.left;
      const y = domEvent.clientY - mapRect.top;
      this.mousePosition.set((2 * x) / mapRect.width - 1, 1 - (2 * y) / mapRect.height);
    };

    const mousemoveListener = map.addListener('mousemove', (ev: google.maps.MapMouseEvent) => {
      updateMousePosition(ev);
      // we can't rely on a running update-loop for this demo.
      overlay.requestRedraw();
    });

    const clickListener = map.addListener('click', (ev: google.maps.MapMouseEvent) => {
      updateMousePosition(ev);
      this.updateRaycaster();

      if (this.highlightedRestaurant) {
        this.setSelected(this.highlightedRestaurant);
        overlay.requestRedraw();
      }
    });

    this.mapListeners = [mousemoveListener, clickListener];
  }

  /**
   * Unbinds all the event-handlers from bindMapEvents.
   * @private
   */
  private unbindMapEvents() {
    this.mapListeners.forEach(listener => listener.remove());
    this.mapListeners = [];
  }

  /**
   * Updates the internal raycaster-state and sets/resets the
   * highlighting-state.
   */
  private updateRaycaster() {
    const intersections = this.overlay.raycast(this.mousePosition);

    // something under the cursor?
    if (intersections.length === 0) {
      if (this.highlightedRestaurant) {
        this.highlightedRestaurant.isHighlighted = false;
        this.highlightedRestaurant = null;
      }

      return;
    }

    const markerUnderCursor = getParentMarker(intersections[0].object);

    let restaurant = null;
    if (markerUnderCursor) {
      restaurant = this.restaurants.find(r => r.id === markerUnderCursor.userData.placeId)!;
    }

    // nothing changed?
    if (restaurant === this.highlightedRestaurant) {
      return;
    }

    if (this.highlightedRestaurant) {
      this.highlightedRestaurant.isHighlighted = false;
    }

    this.highlightedRestaurant = restaurant;

    if (restaurant) {
      restaurant.isHighlighted = true;
    }
  }

  /**
   * Sets the specified marker as selected (restoring a previous selction if
   * there is one), updates the directions and the panel-content.
   */
  private setSelected(restaurant: Restaurant) {
    if (this.selectedRestaurant) {
      this.selectedRestaurant.isSelected = false;
    }

    this.selectedRestaurant = restaurant;
    this.selectedRestaurant.isSelected = true;

    this.restaurantDetailsEl!.place = restaurant.place;

    this.loadDirectionsForRestaurant(this.selectedRestaurant).then(() => {
      this.overlay.requestRedraw();
    });
  }
}

// ---- utility and helper functions below

/**
 * Async wrapper for PlacesService.nearbySearch().
 */
async function placesNearbySearchAsync(
  placesService: google.maps.places.PlacesService,
  request: google.maps.places.PlaceSearchRequest
): Promise<google.maps.places.PlaceResult[]> {
  return new Promise((resolve, reject) => {
    placesService.nearbySearch(request, (results, status, pagination) => {
      if (status !== 'OK') {
        console.warn('places request failed: ' + status);
        reject(new Error(status));
        return;
      }

      if (results === null || results.length === 0) {
        console.warn('places search without results');
        resolve([]);
        return;
      }

      resolve(results);
    });
  });
}

/**
 * Retrieves the parent IconMarker3d of the specified object.
 */
function getParentMarker(obj: Object3D): IconMarker3d | null {
  do {
    if ((obj as IconMarker3d).isIconMarker3d) {
      return obj as IconMarker3d;
    }
  } while (obj.parent && (obj = obj.parent));

  return null;
}
