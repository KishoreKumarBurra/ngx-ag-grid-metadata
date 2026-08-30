import type { IHeaderComp, IHeaderParams } from 'ag-grid-community';
import type { AttributeMetadata } from '../models/attribute-metadata.model';
import type { HeaderInfoConfig } from './behavior.types';

/**
 * Creates an AG Grid header component class that renders the column's
 * display label plus an info icon carrying a tooltip (native `title` +
 * `aria-label`, so no extra tooltip library is required).
 *
 * Framework-agnostic (implements AG Grid's IHeaderComp directly) — no
 * Angular component instantiation or ag-grid-angular dependency required.
 */
export function createInfoIconHeaderRenderer(
  config: HeaderInfoConfig,
  meta: AttributeMetadata,
): new () => IHeaderComp {
  const tooltipText = typeof config.tooltip === 'function' ? config.tooltip(meta) : config.tooltip;
  const iconClass = config.iconClass ?? 'ngx-agm-icon-info';

  return class InfoIconHeaderRenderer implements IHeaderComp {
    private eGui!: HTMLElement;

    init(params: IHeaderParams): void {
      this.eGui = document.createElement('div');
      this.eGui.className = 'ngx-agm-header-with-info';

      const label = document.createElement('span');
      label.className = 'ngx-agm-header-label';
      label.textContent = params.displayName;

      const icon = document.createElement('span');
      icon.className = `ngx-agm-header-info-icon ${iconClass}`;
      icon.setAttribute('role', 'img');
      icon.setAttribute('aria-label', tooltipText);
      icon.setAttribute('title', tooltipText);

      this.eGui.append(label, icon);
    }

    getGui(): HTMLElement {
      return this.eGui;
    }

    refresh(): boolean {
      return false;
    }
  };
}
