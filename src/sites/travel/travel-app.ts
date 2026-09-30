import {App, AppParams} from '~/src/core/app';
import {PAGES} from '~/src/sites/travel/pages';
import {goToNextPage, goToPreviousPage, setCurrentPage} from '~/src/core/store';
import type {Drawer} from '@material/mwc-drawer';
import type {Button} from '@material/mwc-button';
import type {Icon} from '@material/mwc-icon';

const FIRST_PAGE_ID = PAGES.find(p => p.id !== 'intro')!.id;
const LAST_PAGE_ID = PAGES[PAGES.length - 1].id;

export class TravelApp extends App {
  private drawer = document.querySelector<Drawer>('mwc-drawer')!;
  private infoButton = document.querySelector('mwc-fab')!;
  private closeDrawerButton = document.querySelector<Button>('#close-drawer-button')!;
  private loadingBar = document.querySelector<HTMLElement>('#loading-bar')!;
  private backButton = document.querySelector<Button>('#back-button')!;
  private nextButton = document.querySelector<Button>('#next-button')!;
  private pagesContainer = document.querySelector<HTMLElement>('.pages')!;
  private navContainer = document.querySelector<HTMLElement>('.navigation')!;
  private navIcons = Array.from(document.querySelectorAll<Icon>('.nav-icon'));

  constructor(params: AppParams) {
    super({mapsLibararies: 'places', ...params});

    this.registerPages(Object.fromEntries(PAGES.map(p => [p.id, p.pageClass])));

    this.ready.then(() => {
      this.loadingBar.style.display = 'none';
    });
    this.bindNavigationEvents();
    this.bindDrawerEvents();
  }

  private bindDrawerEvents() {
    this.infoButton.addEventListener('click', () => {
      this.drawer.open = !this.drawer.open;
    });

    this.closeDrawerButton.addEventListener('click', () => {
      this.drawer.open = false;
    });
  }

  private bindNavigationEvents() {
    this.navIcons.forEach(navIcon => {
      navIcon.addEventListener('click', () => {
        setCurrentPage(navIcon.dataset.pageId as string);
      });
    });

    this.backButton.addEventListener('click', () => {
      goToPreviousPage();
    });

    this.nextButton.addEventListener('click', () => {
      goToNextPage();
    });
  }

  override setCurrentPage(pageId: string) {
    this.navIcons.forEach(navIcon => {
      navIcon.classList.toggle('nav-icon--active', pageId === navIcon.dataset.pageId);
    });

    this.backButton.disabled = pageId === FIRST_PAGE_ID;
    this.nextButton.disabled = pageId === LAST_PAGE_ID;

    this.pagesContainer.style.display = pageId === 'intro' ? 'none' : '';
    this.navContainer.style.display = pageId === 'intro' ? 'none' : '';

    super.setCurrentPage(pageId);
  }
}
