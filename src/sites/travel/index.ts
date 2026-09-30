import store, {setPageIds} from '~/src/core/store';
import initUrlHandler from '~/src/ui/url-handler';
import {TravelApp} from '~/src/sites/travel/travel-app';

import {MAP_ID, MAPS_API_KEY, MAPS_API_VERSION} from '~/src/config';
import {INITIAL_VIEWPORT} from './config';
import {PAGES} from '~/src/sites/travel/pages';

async function main() {
  setPageIds(PAGES.map(p => p.id));

  initUrlHandler(store);

  const app = new TravelApp({
    initialViewport: INITIAL_VIEWPORT,
    mapId: MAP_ID, // A map ID is a unique identifier that represents Google Map styling and configuration settings that are stored in Google Cloud
    mapsApiKey: MAPS_API_KEY,
    mapsApiVersion: MAPS_API_VERSION
  });

  // wait until app is usable (just waiting for maps-API to load)
  await app.ready;
  store.subscribe(state => app.update(state));
}

main().catch(err => {
  console.error('unexpected error in main(): ', err);
});

export {};
