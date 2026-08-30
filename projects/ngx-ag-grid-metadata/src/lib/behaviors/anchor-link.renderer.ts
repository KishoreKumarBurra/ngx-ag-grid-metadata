import type { ICellRendererParams } from 'ag-grid-community';
import type { AnchorLinkConfig } from './behavior.types';
import { makeClickable } from './internal/clickable-element.util';

/**
 * Creates a cellRenderer function that renders an anchor (`<a>`) when
 * `config.condition` is true (or omitted), and plain text otherwise.
 * Click and keyboard (Enter/Space) activation both invoke `config.onClick`
 * with the full row object, so the consuming application decides what to
 * do with it (navigation, opening a dialog, etc.) without the library
 * needing to know anything about that action.
 */
export function createAnchorLinkRenderer<TRow = Record<string, unknown>>(config: AnchorLinkConfig<TRow>) {
  return (params: ICellRendererParams<TRow>): HTMLElement | string => {
    const row = params.data as TRow;
    const shouldRenderLink = config.condition ? config.condition(row) : true;
    const text = config.displayValue ? config.displayValue(row) : String(params.value ?? '');

    if (!shouldRenderLink) {
      return text;
    }

    const anchor = document.createElement('a');
    anchor.className = 'ngx-agm-anchor-link';
    anchor.textContent = text;
    anchor.setAttribute('role', 'link');

    makeClickable(
      anchor,
      () => config.onClick(row, params.colDef?.field ?? ''),
      { preventDefault: true },
    );

    return anchor;
  };
}
