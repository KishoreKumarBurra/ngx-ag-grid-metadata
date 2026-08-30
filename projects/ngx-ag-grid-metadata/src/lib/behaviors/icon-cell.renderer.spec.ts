import { describe, it, expect, vi } from 'vitest';
import type { ICellRendererParams } from 'ag-grid-community';
import { createIconCellRenderer } from './icon-cell.renderer';

function makeParams(overrides: Partial<ICellRendererParams>): ICellRendererParams {
  return {
    value: 'Completed',
    data: { orderstatus: 'Completed' },
    colDef: { field: 'orderstatus' },
    ...overrides,
  } as ICellRendererParams;
}

describe('createIconCellRenderer', () => {
  it('renders only text when resolve() returns null', () => {
    const renderer = createIconCellRenderer({ resolve: () => null });
    const result = renderer(makeParams({}));

    expect(result.querySelector('.ngx-agm-cell-icon')).toBeNull();
    expect(result.textContent).toBe('Completed');
  });

  it('renders icon before text by default', () => {
    const renderer = createIconCellRenderer({ resolve: () => 'icon-check' });
    const result = renderer(makeParams({}));

    const children = Array.from(result.children);
    expect(children[0].className).toContain('icon-check');
    expect(children[1].textContent).toBe('Completed');
  });

  it('renders icon after text when position is "after"', () => {
    const renderer = createIconCellRenderer({ resolve: () => 'icon-check', position: 'after' });
    const result = renderer(makeParams({}));

    const children = Array.from(result.children);
    expect(children[0].textContent).toBe('Completed');
    expect(children[1].className).toContain('icon-check');
  });

  it('renders icon only when position is "replace"', () => {
    const renderer = createIconCellRenderer({ resolve: () => 'icon-check', position: 'replace' });
    const result = renderer(makeParams({}));

    expect(result.textContent).toBe('');
    expect(result.querySelector('.icon-check')).not.toBeNull();
  });

  it('does not attach click listeners when onClick is not provided', () => {
    const renderer = createIconCellRenderer({ resolve: () => 'icon-check' });
    const result = renderer(makeParams({}));
    const icon = result.querySelector('.ngx-agm-cell-icon') as HTMLElement;

    expect(icon.getAttribute('tabindex')).toBeNull();
  });

  it('invokes onClick with the row when the icon is clicked', () => {
    const onClick = vi.fn();
    const row = { orderstatus: 'Completed', licenseId: 7 };
    const renderer = createIconCellRenderer({ resolve: () => 'icon-check', onClick });
    const result = renderer(makeParams({ data: row }));
    const icon = result.querySelector('.ngx-agm-cell-icon') as HTMLElement;

    icon.dispatchEvent(new MouseEvent('click'));

    expect(onClick).toHaveBeenCalledWith(row);
  });

  it('sets title and aria-label when tooltip is provided', () => {
    const renderer = createIconCellRenderer({
      resolve: () => 'icon-check',
      tooltip: () => 'All good',
    });
    const result = renderer(makeParams({}));
    const icon = result.querySelector('.ngx-agm-cell-icon') as HTMLElement;

    expect(icon.getAttribute('title')).toBe('All good');
    expect(icon.getAttribute('aria-label')).toBe('All good');
  });
});
