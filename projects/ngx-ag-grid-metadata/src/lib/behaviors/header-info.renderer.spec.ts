import { describe, it, expect, vi } from 'vitest';
import type { IHeaderParams } from 'ag-grid-community';
import { createInfoIconHeaderRenderer } from './header-info.renderer';
import type { AttributeMetadata } from '../models/attribute-metadata.model';

function makeMeta(overrides: Partial<AttributeMetadata> = {}): AttributeMetadata {
  return {
    attributeId: 1,
    attributeName: 'ORDERSTATUS',
    objectType: 'WIDGET1',
    filterValue1: '',
    filterValue2: '',
    filterOperator1: '',
    filterOperator2: '',
    columnSortOrder: 0,
    sortType: '',
    attributeDisplayName: 'Order Status',
    isGeneralAttribute: true,
    isIndustryAttribute: false,
    isCustomerAttribute: false,
    dataSource: 'Pega',
    isHidden: false,
    isActionable: false,
    actionType: '',
    referenceAttribute: '',
    attributeDataType: 'STRING',
    columnWidth: 200,
    isFreezable: false,
    isFilterable: true,
    isSortable: true,
    abbrvAttDisplayName: 'Order Status',
    isValueList: false,
    ...overrides,
  };
}

describe('createInfoIconHeaderRenderer', () => {
  it('renders the header label and an info icon with a static tooltip', () => {
    const RendererClass = createInfoIconHeaderRenderer({ tooltip: 'Static tooltip text' }, makeMeta());
    const instance = new RendererClass();
    instance.init!({ displayName: 'Order Status' } as IHeaderParams);
    const gui = instance.getGui();

    expect(gui.querySelector('.ngx-agm-header-label')?.textContent).toBe('Order Status');
    const icon = gui.querySelector('.ngx-agm-header-info-icon') as HTMLElement;
    expect(icon.getAttribute('title')).toBe('Static tooltip text');
    expect(icon.getAttribute('aria-label')).toBe('Static tooltip text');
  });

  it('resolves a function-based tooltip using the column metadata', () => {
    const meta = makeMeta({ attributeName: 'STATUSDATE', attributeDisplayName: 'Date Order Completed' });
    const RendererClass = createInfoIconHeaderRenderer(
      { tooltip: (m) => `Info for ${m.attributeDisplayName}` },
      meta,
    );
    const instance = new RendererClass();
    instance.init!({ displayName: meta.attributeDisplayName } as IHeaderParams);

    const icon = instance.getGui().querySelector('.ngx-agm-header-info-icon') as HTMLElement;
    expect(icon.getAttribute('title')).toBe('Info for Date Order Completed');
  });

  it('applies a custom icon class when provided', () => {
    const RendererClass = createInfoIconHeaderRenderer(
      { tooltip: 'x', iconClass: 'custom-info-icon' },
      makeMeta(),
    );
    const instance = new RendererClass();
    instance.init!({ displayName: 'x' } as IHeaderParams);

    const icon = instance.getGui().querySelector('.ngx-agm-header-info-icon') as HTMLElement;
    expect(icon.className).toContain('custom-info-icon');
  });

  it('refresh() returns false (no in-place refresh support needed)', () => {
    const RendererClass = createInfoIconHeaderRenderer({ tooltip: 'x' }, makeMeta());
    const instance = new RendererClass();
    expect(instance.refresh!({} as never)).toBe(false);
  });
});
