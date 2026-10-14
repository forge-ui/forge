export const REVIEW_STORAGE_KEY = "forge-component-fusion-review-v1";

type ReviewStorage = Pick<Storage, "getItem" | "setItem">;
type StorageListener = (key: string | null) => void;
type ReviewSnapshot = { raw: string; persistenceFailed: boolean };
const EMPTY_SNAPSHOT: ReviewSnapshot = { raw: "{}", persistenceFailed: false };

/** Keep unsaved edits authoritative until a write succeeds. */
export function createReviewStore(
  getStorage: () => ReviewStorage,
  listenToStorage: (listener: StorageListener) => () => void,
) {
  let snapshot = EMPTY_SNAPSHOT;
  let initialized = false;
  let stopListening: (() => void) | undefined;
  const listeners = new Set<() => void>();

  const publish = (next: ReviewSnapshot) => {
    if (next.raw === snapshot.raw && next.persistenceFailed === snapshot.persistenceFailed) return;
    snapshot = next;
    listeners.forEach(listener => listener());
  };
  const refresh = () => {
    if (snapshot.persistenceFailed) return;
    try {
      publish({ raw: getStorage().getItem(REVIEW_STORAGE_KEY) ?? "{}", persistenceFailed: false });
    } catch { /* Reading storage must not discard the current page's copy. */ }
  };
  const getSnapshot = () => {
    if (!initialized) { initialized = true; refresh(); }
    return snapshot;
  };
  const write = (raw: string) => {
    let persistenceFailed = false;
    try { getStorage().setItem(REVIEW_STORAGE_KEY, raw); } catch { persistenceFailed = true; }
    initialized = true;
    publish({ raw, persistenceFailed });
  };

  return {
    getSnapshot,
    getServerSnapshot: () => EMPTY_SNAPSHOT,
    write,
    retry: () => write(getSnapshot().raw),
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      if (listeners.size === 1) {
        stopListening = listenToStorage(key => {
          if (key === REVIEW_STORAGE_KEY || key === null) refresh();
        });
        // Catch writes from another tab between render and subscription.
        refresh();
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) { stopListening?.(); stopListening = undefined; }
      };
    },
  };
}

export const reviewStore = createReviewStore(
  () => window.localStorage,
  listener => {
    const onStorage = (event: StorageEvent) => {
      // sessionStorage events must not affect this localStorage-backed review.
      try { if (event.storageArea && event.storageArea !== window.localStorage) return; } catch { return; }
      listener(event.key);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  },
);
