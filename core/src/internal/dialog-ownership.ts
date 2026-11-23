/** Internal ownership shared by native dialogs and their floating menus. */
type Layer = { element: HTMLElement; escape: () => void; owner: HTMLDialogElement | null; ownerClose?: () => void };
const focusOwners = new WeakMap<HTMLElement, HTMLElement>();
export function dialogReturnTarget(element: HTMLElement | null) {
  for (let current = element; current; current = current.parentElement) {
    const owner = focusOwners.get(current);
    if (owner) return owner;
  }
  return element;
}
export function isDialogInert(element: HTMLElement) {
  const dialog = element.closest('dialog[open]');
  for (let current: HTMLElement | null = element; current; current = current.parentElement) {
    if (current.hasAttribute('inert')) return true;
    if (current === dialog) break; // Native modal descendants escape ancestor inertness.
  }
  return false;
}
const layers = new WeakMap<Document, Layer[]>();

function topLayer(document: Document) {
  return (layers.get(document) ?? []).filter(layer => layer.element.isConnected && !isDialogInert(layer.element)).reduce<Layer | undefined>((top, layer) => {
    // A nested dialog remains above its parent even when React runs child effects first.
    if (top && layer.element.contains(top.element)) return top;
    return layer;
  }, undefined);
}

export function registerDialogLayer(element: HTMLElement, escape: () => void, focusOwner?: HTMLElement | null, ownerClose?: () => void) {
  if (focusOwner) focusOwners.set(element, focusOwner);
  const document = element.ownerDocument;
  const list = layers.get(document) ?? [];
  const owner = element.parentElement?.closest<HTMLDialogElement>('dialog') ?? (document.activeElement as HTMLElement | null)?.closest<HTMLDialogElement>('dialog[open]') ?? null;
  const layer: Layer = { element, escape, owner: owner && !element.contains(owner) ? owner : null, ownerClose };
  if (!list.length) {
    document.addEventListener('keydown', captureEscape, true);
    document.addEventListener('keydown', bubbleEscape);
  }
  list.push(layer);
  layers.set(document, list);
  function handleEscape(event: KeyboardEvent, capture: boolean) {
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    const top = topLayer(document);
    if (!top || (top.element.tagName !== 'DIALOG') !== capture) return;
    // Native popovers sit above their owning dialog and dismiss themselves on Escape.
    if (!capture) {
      try {
        if ([...document.querySelectorAll<HTMLElement>('[popover]:popover-open')].some(node => node.closest('dialog[open]') === top.element)) return;
      } catch { /* Older DOM test environments do not implement :popover-open. */ }
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    top.escape();
  }
  function captureEscape(event: KeyboardEvent) { handleEscape(event, true); }
  function bubbleEscape(event: KeyboardEvent) { handleEscape(event, false); }
  // Keep the first listener alive until the final layer is removed.
  const listeners = escapeListeners.get(document);
  if (!listeners) escapeListeners.set(document, { captureEscape, bubbleEscape });
  return () => {
    focusOwners.delete(element);
    const index = list.indexOf(layer);
    if (index >= 0) list.splice(index, 1);
    if (!list.length) {
      const handlers = escapeListeners.get(document)!;
      document.removeEventListener('keydown', handlers.captureEscape, true);
      document.removeEventListener('keydown', handlers.bubbleEscape);
      escapeListeners.delete(document);
    }
  };
}
const escapeListeners = new WeakMap<Document, { captureEscape: (event: KeyboardEvent) => void; bubbleEscape: (event: KeyboardEvent) => void }>();

export function ownsDialogLayer(owner: HTMLDialogElement, candidate: Element | null): boolean {
  if (!candidate) return false;
  if (owner.contains(candidate)) return true;
  const layer = (layers.get(owner.ownerDocument) ?? []).find(item => item.element === candidate);
  return !!layer?.owner && (layer.owner === owner || ownsDialogLayer(owner, layer.owner));
}

export function closeOwnedDialogLayers(owner: HTMLDialogElement) {
  for (const layer of [...(layers.get(owner.ownerDocument) ?? [])]) {
    if (layer.owner !== owner) continue;
    if (layer.element.tagName === 'DIALOG') closeOwnedDialogLayers(layer.element as HTMLDialogElement);
    layer.ownerClose?.();
  }
}

export function isTopDialogLayer(dialog: HTMLDialogElement) { return topLayer(dialog.ownerDocument)?.element === dialog; }

export function isTopDialog(dialog: HTMLDialogElement) {
  const list = (layers.get(dialog.ownerDocument) ?? []).filter(layer => layer.element.tagName === 'DIALOG' && (layer.element as HTMLDialogElement).open && !isDialogInert(layer.element));
  const top = list.reduce<HTMLElement | undefined>((current, layer) => current && layer.element.contains(current) ? current : layer.element, undefined);
  return !top || top === dialog;
}


export function focusIfAvailable(element: HTMLElement | null) {
  if (!element?.isConnected || isDialogInert(element) || element.closest('dialog')?.hasAttribute('open') === false || element.matches(':disabled, [aria-disabled="true"]') || !element.getClientRects().length) return false;
  element.focus({ preventScroll: true });
  return element.ownerDocument.activeElement === element;
}
