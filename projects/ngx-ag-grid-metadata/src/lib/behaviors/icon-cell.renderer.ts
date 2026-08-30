import type { ICellRendererParams } from 'ag-grid-community';
import type { IconConfig } from './behavior.types';
import { makeClickable } from './internal/clickable-element.util';

/**
 * Creates a cellRenderer function that renders an icon (a <span> carrying
 * `config.resolve(row)`'s returned CSS class) before, after, or in place of
 * the cell's text value. Click handling is optional — a purely decorative
 * icon needs no listeners at all.
 *
 * The library ships no icon assets itself: `resolve()` returns a class
 * name string only, and the consuming application supplies the actual
 * icon font/SVG/sprite via its own CSS.
 */
export function createIconCellRenderer<TRow = Record<string, unknown>>(config: IconConfig<TRow>) {
  return (params: ICellRendererParams<TRow>): HTMLElement => {
    const row = params.data as TRow;
    const iconClass = config.resolve(row);
    const container = document.createElement('span');
    container.className = 'ngx-agm-icon-cell';

    const textSpan = document.createElement('span');
    textSpan.textContent = String(params.value ?? '');

    if (!iconClass) {
      container.appendChild(textSpan);
      return container;
    }

    const icon = document.createElement('span');
    icon.className = `ngx-agm-cell-icon ${iconClass}`;
    icon.setAttribute('role', 'img');

    const tooltipText = config.tooltip?.(row);
    if (tooltipText) {
      icon.setAttribute('title', tooltipText);
      icon.setAttribute('aria-label', tooltipText);
    }

    if (config.onClick) {
      icon.style.cursor = 'pointer';
      makeClickable(icon, () => config.onClick!(row));
    }

    if (config.position === 'replace') {
      container.appendChild(icon);
      return container;
    }

    if (config.position === 'after') {
      container.append(textSpan, icon);
      return container;
    }

    container.append(icon, textSpan); // default: 'before'
    return container;
  };
}
