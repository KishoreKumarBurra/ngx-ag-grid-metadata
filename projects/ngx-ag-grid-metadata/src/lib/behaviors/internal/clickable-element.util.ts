/**
 * Wires a click handler onto an element with keyboard-accessible activation
 * (Enter/Space), matching the pattern already used for anchor-style cells
 * in the existing dashboard code. Internal-only — not part of the public
 * API; both the anchor-link and icon-cell renderers use this to avoid
 * duplicating the same event-handling boilerplate.
 */
export function makeClickable(
  element: HTMLElement,
  onActivate: (event: Event) => void,
  options?: { stopPropagation?: boolean; preventDefault?: boolean },
): void {
  element.setAttribute('tabindex', '0');

  const activate = (event: Event): void => {
    if (options?.preventDefault) {
      event.preventDefault();
    }
    if (options?.stopPropagation ?? true) {
      event.stopPropagation();
    }
    onActivate(event);
  };

  element.addEventListener('click', activate);
  element.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      activate(event);
    }
  });
}
