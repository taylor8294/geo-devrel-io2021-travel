import {IntroPage} from '~/src/sites/travel/pages/intro';
import {FlightsPage} from '~/src/sites/travel/pages/flights';
import {TaxisPage} from '~/src/sites/travel/pages/taxis';
import {HotelsPage} from '~/src/sites/travel/pages/hotels';
import {RestaurantsPage} from '~/src/sites/travel/pages/restaurants';
import {SightsPage} from '~/src/sites/travel/pages/sights';
import type {PageConstructor} from '~/src/core/page';

export interface PageData {
  id: string;
  pageClass: PageConstructor;
}

export const PAGES = [
  {id: 'intro', pageClass: IntroPage},
  {id: 'flights', pageClass: FlightsPage},
  {id: 'taxis', pageClass: TaxisPage},
  {id: 'hotels', pageClass: HotelsPage},
  {id: 'restaurants', pageClass: RestaurantsPage},
  {id: 'sights', pageClass: SightsPage}
];
