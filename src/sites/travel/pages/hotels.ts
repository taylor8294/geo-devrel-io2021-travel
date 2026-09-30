/*
 * This page illustrates how single buildings can be highlighted by wrapping
 * them into a slightly larger geometry rendered in the WebGLOverlay.
 *
 * Rendering this object will write to the depth-buffer which will then prevent
 * the buildings renderpass of the maps renderer from also drawing at the same
 * location.
 */

import {easeInOutQuad} from '~/src/util/easings';
import {Page} from '~/src/core/page';
import IconMarker3d from '~/src/three/icon-marker-3d';
import HotelMesh from '~/src/sites/travel/three/hotel-mesh';

import type TravelHotel from '~/src/sites/travel/components/travel-hotel';

import ACCOMODATION_ICON from '~/dist/static/travel/images/accomodation-marker-green.svg';

const ANIMATION_DURATION = 4000;
const TARGET_HEADING = 200;
const START_DELAY = 100;
const BUILDING_HEIGHT = 32.1;
const LINE_MATERIAL_COLOR = 0x0f9d58;

const initialViewport = {
  center: {lat: 51.50706959210838, lng: -0.14162040885065785},
  heading: 100,
  tilt: 67.5,
  zoom: 18.2
};

const ACCOMODATION_MARKER_POSITION: google.maps.LatLngAltitudeLiteral = {
  lat: initialViewport.center.lat,
  lng: initialViewport.center.lng,
  altitude: BUILDING_HEIGHT
};

const PLACE_DETAILS_REQUEST: google.maps.places.PlaceDetailsRequest = {
  placeId: 'ChIJV8gP0ykFdkgRFEAEHoE1YVk',
  fields: ['name', 'rating', 'user_ratings_total', 'formatted_address', 'photos']
};

export class HotelsPage extends Page {
  protected override originCoordinates = initialViewport.center;

  private placesService?: google.maps.places.PlacesService;
  private hotelEl?: TravelHotel;

  private sceneStartTimestamp = 0;

  private hotelMesh: HotelMesh = new HotelMesh();
  private accomodationMarker: IconMarker3d = new IconMarker3d({
    iconSrc: ACCOMODATION_ICON,
    iconSize: 12,
    color: LINE_MATERIAL_COLOR,
    labelHeight: 10,
    baseZoom: 19
  });

  initialize() {
    this.hotelEl = document.querySelector('travel-hotel')!;
    this.placesService = new google.maps.places.PlacesService(this.basemap.getMapInstance());

    this.initScene();

    // load the details to show in the html-overlay
    placesGetDetailsAsync(this.placesService, PLACE_DETAILS_REQUEST).then(place => {
      this.hotelEl!.place = place;
    });
  }

  start() {
    this.sceneStartTimestamp = performance.now();
    this.basemap.setCamera(initialViewport);
  }

  initScene() {
    this.overlay.latLngAltToVector3(HotelMesh.referenceCoords, this.hotelMesh.position);

    this.overlay.latLngAltToVector3(ACCOMODATION_MARKER_POSITION, this.accomodationMarker.position);

    this.overlay.getScene().add(this.hotelMesh, this.accomodationMarker);
  }

  update() {
    this.hotelMesh!.setViewportSize(this.overlay.getViewportSize());
    this.accomodationMarker!.update(this.basemap.getCamera());

    this.updateInitialCameraAnimation();
  }

  private updateInitialCameraAnimation() {
    const sceneTime = performance.now() - START_DELAY - this.sceneStartTimestamp;

    if (sceneTime < 0 || sceneTime > ANIMATION_DURATION) return;

    const animationProgress = easeInOutQuad(sceneTime / ANIMATION_DURATION);
    const newHeading =
      animationProgress * TARGET_HEADING + (1 - animationProgress) * initialViewport.heading;

    this.basemap.setCamera({heading: newHeading});
  }
}

/**
 * Async wrapper for PlacesService.getDetails().
 */
async function placesGetDetailsAsync(
  placesService: google.maps.places.PlacesService,
  request: google.maps.places.PlaceDetailsRequest
): Promise<google.maps.places.PlaceResult> {
  return new Promise((resolve, reject) => {
    placesService.getDetails(request, (place, status) => {
      if (status !== 'OK' || place === null) {
        console.warn('places request failed: ' + status);
        reject(new Error(status));
        return;
      }

      resolve(place);
    });
  });
}
