/*
 * A minimal state-container to manage navigation-state. This stores all the state-variables
 * that will be linked to the URL.
 */

export interface AppState {
  currentPage: string;
  pageIds: string[];
}

type ListenerFunction = (state: AppState) => void;
type UnsubscribeFunction = () => void;

let state: AppState = {
  currentPage: 'intro',
  pageIds: []
};

const listeners: Set<ListenerFunction> = new Set();

// this is the only place where the state gets modified.
// Note that every change results in a new state-object.
function setState(newState: Partial<AppState>): void {
  state = {...state, ...newState};
  listeners.forEach(fn => fn(state));
}

export interface Store {
  getState(): AppState;
  subscribe(fn: ListenerFunction): UnsubscribeFunction;
}

const store: Store = {
  getState(): AppState {
    return state;
  },

  /**
   * Subscribes the given function for changes to the state.
   * As the intention is to keep some module informed about all changes
   * to the state, it will also immediately dispatch a change when subscribed.
   * @param fn
   */
  subscribe(fn: ListenerFunction): UnsubscribeFunction {
    listeners.add(fn);
    setTimeout(() => fn(state), 0);

    return () => void listeners.delete(fn);
  }
};
export default store;

// ---- "action" definitions
export function setPageIds(pageIds: string[]) {
  setState({pageIds});
}

export function setCurrentPage(pageId: string) {
  if (state.pageIds.length === 0) {
    console.warn('setCurrentPage(): called before pageIds were initialized.');
  }

  if (state.pageIds.length > 0 && !state.pageIds.includes(pageId)) {
    console.error(`setCurrentPage(): invalid pageId '${pageId}'`);
    setCurrentPage('intro');
    return;
  }

  setState({currentPage: pageId});
}

export function goToPreviousPage() {
  const {currentPage, pageIds} = store.getState();
  const prevIndex = Math.max(0, pageIds.indexOf(currentPage) - 1);

  setCurrentPage(pageIds[prevIndex]);
}

export function goToNextPage() {
  const {currentPage, pageIds} = store.getState();
  const nextIndex = Math.min(pageIds.length - 1, pageIds.indexOf(currentPage) + 1);

  setCurrentPage(pageIds[nextIndex]);
}
