/*
 * This example shows a couple of landmarks in london loaded from the places-API
 * along with a walking-directions line connecting all of them and back to the
 * hotel.
 */

import SightsMarker from '../three/sights-marker';
import DottedDirectionsLine from '~/src/three/dotted-directions-line';
import OriginMarker from '~/src/three/origin-marker';
import IconMarker3d from '~/src/three/icon-marker-3d';

import {easeInOutCubic} from '~/src/util/easings';
import type {CameraAnimation} from '~/src/map/camera-animation';
import type TravelSights from '~/src/sites/travel/components/travel-sights';
import {Page} from '~/src/core/page';

import SIGHTS_PLACES from '~/dist/static/travel/data/sights-places.json';
import ACCOMODATION_ICON from '~/dist/static/travel/images/accomodation-marker-purple.svg';

const THEME_COLOR = 0x590ed1;

const INITIAL_CAMERA = {
  center: {lat: 51.499566, lng: -0.122858},
  heading: 70,
  tilt: 67,
  zoom: 17.4
};

const ANIMATION_START_CAMERA = {
  center: {
    lat: 51.50235459595671,
    lng: -0.12898104249663866
  },
  zoom: 15.5,
  heading: 52.66666666666657,
  tilt: 25
};

const ANIMATION_END_CAMERA = {
  center: {
    lat: 51.49970749364103,
    lng: -0.12768149076912927
  },
  zoom: 17.6,
  heading: 112.99999999999994,
  tilt: 67.5
};

const ANCHOR_POSITION = {lat: 51.5010794, lng: -0.1248092};
const ORIGIN_LOCATION = {lat: 51.5016527, lng: -0.1298745};

// manually curated waypoints for a nice roundtrip (up to 10 are
// allowed in the regular pricing-bracket for the directions-API)
const DIRECTIONS_WAYPOINTS = [
  {lat: 51.4995167, lng: -0.1288148},
  {lat: 51.5002555, lng: -0.1259773},
  {lat: 51.5010535, lng: -0.1245272},
  {lat: 51.5032943, lng: -0.1193766},
  {lat: 51.5068041, lng: -0.1233415},
  {lat: 51.5025741, lng: -0.1354728},
  {lat: 51.5010248, lng: -0.1406709}
];
const END_LOCATION = {lat: 51.5071821, lng: -0.1417641};
const ACCOMODATION_MARKER_LOCATION = {lat: 51.5071821, lng: -0.1417641};

// let headingAlternator = false;

export interface Attraction {
  place: google.maps.places.PlaceResult;
  coordinates: google.maps.LatLngAltitudeLiteral;
}

export class SightsPage extends Page {
  protected originCoordinates = ANCHOR_POSITION;

  private directionsService?: google.maps.DirectionsService;
  private placesService?: google.maps.places.PlacesService;
  private attractions: Attraction[] = [];

  private markers: SightsMarker[] = [];
  private originMarker?: OriginMarker;
  private accomodationMarker?: IconMarker3d;
  private introAnimation: CameraAnimation | null = null;
  private introAnimationTimer = 0;
  private lastHeadingOffset = -10;
  private selectedPlace?: google.maps.places.PlaceResult;

  async initialize() {
    this.directionsService = new google.maps.DirectionsService();
    this.placesService = new google.maps.places.PlacesService(this.basemap.getMapInstance());

    this.attractions = await loadAttractions(this.placesService);

    const sightsContainer = this.rootEl.querySelector('travel-sights')! as TravelSights;
    sightsContainer.sights = this.attractions.map(a => a.place);
    sightsContainer.requestUpdate();

    sightsContainer.addEventListener('place-selected', ev => {
      const place = ev.detail;

      if (place && place !== this.selectedPlace) {
        this.animateToPlace(place);
        this.selectedPlace = place;
      }
    });

    const sceneInitialized = this.initScene();
    const directionsLoaded = this.loadDirections(ORIGIN_LOCATION, END_LOCATION);

    Promise.all([sceneInitialized, directionsLoaded]).then(() => this.overlay.requestRedraw());
  }

  start() {
    this.basemap.setCamera(ANIMATION_START_CAMERA);

    this.introAnimationTimer = window.setTimeout(() => {
      this.introAnimation = this.basemap.animateToLinear(
        ANIMATION_END_CAMERA,
        3000,
        easeInOutCubic
      );
    }, 1000);
  }

  update() {
    if (this.markers.length === 0) return;

    const overlay = this.overlay!;
    const map = this.basemap.getMapInstance();

    const markerProps = {
      heading: map.getHeading(),
      tilt: map.getTilt(),
      zoom: map.getZoom()
    };

    this.originMarker!.update(markerProps);
    this.accomodationMarker!.update(markerProps);
    const updateComplete = this.markers.every(marker => marker.update(markerProps));

    if (!updateComplete) {
      overlay.requestRedraw();
    }
  }

  stop() {
    clearTimeout(this.introAnimationTimer);
    if (this.introAnimation) {
      this.introAnimation.dispose();
      this.introAnimation = null;
    }
  }

  /**
   * Sets up the scene with all the markers for current position,
   * attractions and accomodation.
   */
  private async initScene() {
    const overlay = this.overlay!;
    const scene = overlay.getScene();

    this.originMarker = new OriginMarker({
      color: THEME_COLOR,
      size: 30,
      baseZoom: INITIAL_CAMERA.zoom
    });
    overlay.latLngAltToVector3(ORIGIN_LOCATION, this.originMarker.position);
    scene.add(this.originMarker);

    this.accomodationMarker = new IconMarker3d({
      iconSrc: ACCOMODATION_ICON,
      iconSize: 42,
      color: THEME_COLOR,
      labelHeight: 40
    });

    overlay.latLngAltToVector3(ACCOMODATION_MARKER_LOCATION, this.accomodationMarker.position);
    scene.add(this.accomodationMarker);

    for (const attraction of this.attractions) {
      this.markers.push(this.createMarker(attraction));
    }
    scene.add(...this.markers);
  }

  /**
   * Creates an attractions-marker for the given attraction.
   */
  private createMarker(attraction: Attraction) {
    const name = attraction.place!.name!.replace('lastminute.com', '');

    const marker = new SightsMarker({
      label: name,
      width: 120,
      altitude: attraction.coordinates.altitude,
      baseZoom: INITIAL_CAMERA.zoom
    });

    this.overlay!.latLngAltToVector3(
      {
        lat: attraction.coordinates.lat,
        lng: attraction.coordinates.lng
      },
      marker.position
    );

    return marker;
  }

  /**
   * Loads the routing along the waypoints specified above and adds the
   * resulting polyline to the scene.
   */
  private async loadDirections(
    startPoint: google.maps.LatLngLiteral,
    endPoint: google.maps.LatLngLiteral
  ) {
    const overlay = this.overlay!;
    const result = await this.directionsService!.route({
      origin: startPoint,
      destination: endPoint,
      waypoints: DIRECTIONS_WAYPOINTS.map(ll => ({
        location: new google.maps.LatLng(ll),
        stopover: true
      })),
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING
    });

    if (result === null || result.routes.length === 0) {
      console.warn('no routing result!');
      return;
    }

    const route = result.routes[0].overview_path;
    const directionsLine = new DottedDirectionsLine(
      route.map(ll => overlay.latLngAltToVector2(ll.toJSON())),
      {color: THEME_COLOR, opacity: 1, pointSize: 5, pointSpacing: 10}
    );

    overlay.getScene().add(directionsLine);
  }

  private animateToPlace(place: google.maps.places.PlaceResult) {
    const map = this.basemap.getMapInstance();

    clearTimeout(this.introAnimationTimer);
    if (this.introAnimation) {
      this.introAnimation.dispose();
      this.introAnimation = null;
    }

    this.basemap.syncCamera();

    // slightly animate the heading to make it look less boring..
    const headingOffset = this.lastHeadingOffset * -1;
    this.lastHeadingOffset = headingOffset;

    const toCamera = {
      center: place.geometry!.location,
      heading: map.getHeading()! + headingOffset,
      tilt: ANIMATION_END_CAMERA.tilt,
      zoom: ANIMATION_END_CAMERA.zoom
    };

    this.basemap.animateToLinear(toCamera, 1000, easeInOutCubic);
  }
}

// make sure to only load details once
let attractionsPromise: Promise<Attraction[]> | null = null;

/**
 * Load details from the places-API.
 */
async function loadAttractions(
  placesService: google.maps.places.PlacesService
): Promise<Attraction[]> {
  if (attractionsPromise === null) {
    attractionsPromise = Promise.all(
      SIGHTS_PLACES.map(({place_id: placeId, coordinates}) =>
        placesGetDetailsAsync(placesService, placeId, coordinates)
      )
    );
  }

  return attractionsPromise;
}

/**
 * Async wrapper for PlacesService.getDetails.
 */
function placesGetDetailsAsync(
  service: google.maps.places.PlacesService,
  placeId: string,
  coordinates: google.maps.LatLngAltitudeLiteral
): Promise<Attraction> {
  const request = {
    placeId: placeId,
    fields: [
      'place_id',
      'name',
      'rating',
      'user_ratings_total',
      'formatted_address',
      'photos',
      'geometry'
    ]
  };

  return new Promise((resolve, reject) => {
    service.getDetails(request, (place, status) => {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        reject(new Error('places api error'));
        return;
      }

      if (!place) {
        reject(new Error('places api returned no result'));
        return;
      }

      resolve({place, coordinates});
    });
  });
}
