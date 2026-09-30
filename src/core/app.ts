import type {Page, PageConstructor} from './page';
import type {AppState} from './store';
import {Basemap} from '../map/basemap';

export interface AppParams {
  initialViewport: google.maps.CameraOptions;
  mapId: string;
  mapsApiKey: string;
  mapsApiVersion?: string;
  mapsLibararies?: string;
}

/**
 * Tha App class is responsible for creating the basemap and the pages and updates the pages
 * based on the navigations state.
 */
export class App {
  protected readonly pageTypes = new Map<string, PageConstructor<any>>();
  protected readonly pages = new Map<string, Page>();

  protected readonly basemap: Basemap;
  protected currentPageId: string | null = null;
  protected currentPage: Page | null = null;

  readonly ready: Promise<void>;

  constructor(params: AppParams) {
    this.basemap = new Basemap(document.querySelector('.map-container') as HTMLElement, {
      initialViewport: params.initialViewport,
      libraries: params.mapsLibararies
    });

    // forward map-initialization promise
    this.ready = this.basemap.mapReady;
  }

  registerPages(pages: {[pageId: string]: PageConstructor<any>}) {
    for (let [pageId, ctor] of Object.entries(pages)) {
      this.pageTypes.set(pageId, ctor);
    }
  }

  registerPage(pageId: string, page: PageConstructor<any>) {
    this.pageTypes.set(pageId, page);
  }

  update(state: AppState) {
    this.setCurrentPage(state.currentPage);
  }

  setCurrentPage(pageId: string) {
    if (!this.pageTypes.has(pageId)) {
      console.error(`setCurrentPage(): invalid pageId "${pageId}"`);
      return;
    }

    if (pageId === this.currentPageId) {
      return;
    }

    if (this.currentPage !== null) {
      this.currentPage.stop();
      this.currentPage.hide();
    }

    this.currentPage = this.getPage(pageId);
    this.currentPageId = pageId;
    this.currentPage.show();
    this.currentPage.start();
  }

  /**
   * Gets an existing page-instance or creates it when retrieved for the first time
   * @param pageId
   * @private
   */
  private getPage(pageId: string): Page {
    if (!this.pages.has(pageId)) {
      const PageCtor: PageConstructor = this.pageTypes.get(pageId)!;
      const pageEl = document.querySelector<HTMLElement>(`#${pageId}`);

      if (!pageEl) {
        throw new Error(`App.setCurrentPage(): failed to find element using selector #${pageId}`);
      }

      this.pages.set(pageId, new PageCtor(pageEl, this.basemap));
    }

    // can't be null/undefined at this point
    return this.pages.get(pageId) as Page;
  }
}
