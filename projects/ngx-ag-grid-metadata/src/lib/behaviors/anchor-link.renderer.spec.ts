import { describe, it, expect, vi } from 'vitest';
import type { ICellRendererParams } from 'ag-grid-community';
import { createAnchorLinkRenderer } from './anchor-link.renderer';

function makeParams(overrides: Partial<ICellRendererParams>): ICellRendererParams {
  return {
    value: 'Sample Text',
    data: {},
    colDef: { field: 'licenseName' },
    ...overrides,
  } as ICellRendererParams;
}

describe('createAnchorLinkRenderer', () => {
  it('renders an anchor when condition is omitted', () => {
    const onClick = vi.fn();
    const renderer = createAnchorLinkRenderer({ onClick });

    const result = renderer(makeParams({ value: 'Click me' }));

    expect(result instanceof HTMLElement).toBe(true);
    expect((result as HTMLElement).tagName).toBe('A');
    expect((result as HTMLElement).textContent).toBe('Click me');
  });

  it('renders plain text when condition returns false', () => {
    const onClick = vi.fn();
    const renderer = createAnchorLinkRenderer({ condition: () => false, onClick });

    const result = renderer(makeParams({ value: 'Not a link' }));

    expect(result).toBe('Not a link');
  });

  it('renders an anchor when condition returns true', () => {
    const onClick = vi.fn();
    const renderer = createAnchorLinkRenderer({ condition: () => true, onClick });

    const result = renderer(makeParams({}));

    expect(result instanceof HTMLElement).toBe(true);
  });

  it('calls onClick with the full row and field name on click', () => {
    const onClick = vi.fn();
    const row = { licenseId: 42, licenseName: 'Business License' };
    const renderer = createAnchorLinkRenderer({ onClick });

    const anchor = renderer(makeParams({ data: row, colDef: { field: 'licenseName' } })) as HTMLElement;
    anchor.dispatchEvent(new MouseEvent('click'));

    expect(onClick).toHaveBeenCalledWith(row, 'licenseName');
  });

  it('calls onClick on Enter and Space keydown', () => {
    const onClick = vi.fn();
    const row = { licenseId: 1 };
    const renderer = createAnchorLinkRenderer({ onClick });
    const anchor = renderer(makeParams({ data: row })) as HTMLElement;

    anchor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    anchor.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('uses displayValue override when provided', () => {
    const onClick = vi.fn();
    const renderer = createAnchorLinkRenderer({
      onClick,
      displayValue: (row: { licenseName: string }) => `Link: ${row.licenseName}`,
    });

    const result = renderer(makeParams({ data: { licenseName: 'ABC' }, value: 'ABC' })) as HTMLElement;

    expect(result.textContent).toBe('Link: ABC');
  });
});
