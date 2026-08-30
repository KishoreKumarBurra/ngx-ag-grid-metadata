import { describe, it, expect, vi } from 'vitest';
import { buildColumnDefs } from './column-builder';
import type { AttributeMetadata } from '../models/attribute-metadata.model';

function makeMeta(overrides: Partial<AttributeMetadata>): AttributeMetadata {
  return {
    attributeId: 1,
    attributeName: 'ORDERTYPE',
    objectType: 'WIDGET1',
    filterValue1: '',
    filterValue2: '',
    filterOperator1: '',
    filterOperator2: '',
    columnSortOrder: 0,
    sortType: '',
    attributeDisplayName: 'Filing Type',
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
    abbrvAttDisplayName: 'Filing Type',
    isValueList: false,
    ...overrides,
  };
}

describe('buildColumnDefs', () => {
  it('maps headerName from attributeDisplayName and field/colId from attributeName', () => {
    const [colDef] = buildColumnDefs([
      makeMeta({ attributeName: 'LICENSENAME', attributeDisplayName: 'License Name' }),
    ]);

    expect(colDef.headerName).toBe('License Name');
    expect(colDef.field).toBe('LICENSENAME');
    expect(colDef.colId).toBe('LICENSENAME');
    expect(colDef.sourceAttributeName).toBe('LICENSENAME');
  });

  it('falls back to abbrvAttDisplayName when attributeDisplayName is empty', () => {
    const [colDef] = buildColumnDefs([makeMeta({ attributeDisplayName: '', abbrvAttDisplayName: 'Abbrv' })]);
    expect(colDef.headerName).toBe('Abbrv');
  });

  it('excludes hidden columns entirely', () => {
    const result = buildColumnDefs([
      makeMeta({ attributeName: 'VISIBLE', isHidden: false }),
      makeMeta({ attributeName: 'HIDDEN', isHidden: true }),
    ]);

    expect(result.length).toBe(1);
    expect(result[0].sourceAttributeName).toBe('VISIBLE');
  });

  it('applies filter false when isFilterable is false, regardless of data type', () => {
    const [colDef] = buildColumnDefs([makeMeta({ isFilterable: false, attributeDataType: 'DATE' })]);
    expect(colDef.filter).toBe(false);
  });

  it('resolves filter type from attributeDataType using the default filter map', () => {
    const [dateCol] = buildColumnDefs([makeMeta({ attributeDataType: 'DATE', isFilterable: true })]);
    const [numberCol] = buildColumnDefs([makeMeta({ attributeDataType: 'NUMBER', isFilterable: true })]);

    expect(dateCol.filter).toBe('agDateColumnFilter');
    expect(numberCol.filter).toBe('agNumberColumnFilter');
  });

  it('never throws for a missing or unrecognized attributeDataType', () => {
    expect(() =>
      buildColumnDefs([makeMeta({ attributeDataType: undefined as unknown as string, isFilterable: true })]),
    ).not.toThrow();

    const [colDef] = buildColumnDefs([
      makeMeta({ attributeDataType: undefined as unknown as string, isFilterable: true }),
    ]);
    expect(colDef.filter).toBe('agTextColumnFilter');
  });

  it('sets pinned to "left" when isFreezable is true, otherwise undefined', () => {
    const [pinned] = buildColumnDefs([makeMeta({ isFreezable: true })]);
    const [unpinned] = buildColumnDefs([makeMeta({ isFreezable: false })]);

    expect(pinned.pinned).toBe('left');
    expect(unpinned.pinned).toBeUndefined();
  });

  it('applies a custom filterRegistry when provided', () => {
    const customFilterFn = vi.fn().mockReturnValue('customFilter');
    const [colDef] = buildColumnDefs([makeMeta({ isFilterable: true })], {
      filterRegistry: { resolve: customFilterFn } as never,
    });

    expect(colDef.filter).toBe('customFilter');
  });

  it('matches columnBehaviors keys case-insensitively against attributeName', () => {
    const onClick = vi.fn();
    const [colDef] = buildColumnDefs([makeMeta({ attributeName: 'LICENSENAME' })], {
      columnBehaviors: {
        licenseName: { anchorLink: { onClick } }, // deliberately different casing
      },
    });

    expect(typeof colDef.cellRenderer).toBe('function');
  });

  it('applies headerComponent when headerInfo behavior is configured', () => {
    const [colDef] = buildColumnDefs([makeMeta({ attributeName: 'ORDERSTATUS' })], {
      columnBehaviors: {
        ORDERSTATUS: { headerInfo: { tooltip: 'Explains the status' } },
      },
    });

    expect(colDef.headerComponent).toBeDefined();
  });

  it('applies anchorLink cellRenderer over icon when both are misconfigured on the same column', () => {
    const [colDef] = buildColumnDefs([makeMeta({ attributeName: 'LICENSENAME' })], {
      columnBehaviors: {
        LICENSENAME: {
          anchorLink: { onClick: () => undefined },
          icon: { resolve: () => 'some-icon' },
        },
      },
    });

    expect(typeof colDef.cellRenderer).toBe('function');
  });

  it('throws a clear error when a toggle behavior is configured (deferred feature)', () => {
    expect(() =>
      buildColumnDefs([makeMeta({ attributeName: 'ISACTIVE' })], {
        columnBehaviors: {
          ISACTIVE: {
            toggle: {
              getValue: () => true,
              onChange: () => undefined,
            },
          },
        },
      }),
    ).toThrowError(/toggle behavior/i);
  });

  it('calls postProcess exactly once per column with the generated colDef and original metadata', () => {
    const postProcess = vi.fn().mockImplementation((colDef: unknown) => colDef);
    const metadata = [makeMeta({ attributeName: 'A' }), makeMeta({ attributeName: 'B' })];

    buildColumnDefs(metadata, { postProcess });

    expect(postProcess).toHaveBeenCalledTimes(2);
    expect(postProcess.mock.calls[0][1]).toBe(metadata[0]);
  });

  it('lets postProcess override the generated colDef', () => {
    const [colDef] = buildColumnDefs([makeMeta({})], {
      postProcess: (base) => ({ ...base, width: 999 }),
    });

    expect(colDef.width).toBe(999);
  });

  it('produces valid output for the confirmed standard metadata shape end-to-end', () => {
    const metadata: AttributeMetadata[] = [
      makeMeta({ attributeName: 'ORDERTYPE', attributeDisplayName: 'Filing Type', attributeDataType: 'VALUE LIST' }),
      makeMeta({ attributeName: 'STATUSDATE', attributeDisplayName: 'Date Order Completed', attributeDataType: 'DATE' }),
    ];

    const result = buildColumnDefs(metadata);

    expect(result.length).toBe(2);
    expect(result[1].filter).toBe('agDateColumnFilter');
  });
});
