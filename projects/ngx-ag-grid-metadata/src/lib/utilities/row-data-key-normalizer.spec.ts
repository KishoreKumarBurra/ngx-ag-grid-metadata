import { describe, it, expect, vi } from 'vitest';
import { normalizeRowDataKeys } from './row-data-key-normalizer';
import type { AttributeMetadata } from '../models/attribute-metadata.model';

function makeMeta(attributeName: string): AttributeMetadata {
  return {
    attributeId: 1,
    attributeName,
    objectType: 'WIDGET1',
    filterValue1: '',
    filterValue2: '',
    filterOperator1: '',
    filterOperator2: '',
    columnSortOrder: 0,
    sortType: '',
    attributeDisplayName: attributeName,
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
    abbrvAttDisplayName: attributeName,
    isValueList: false,
  };
}

describe('normalizeRowDataKeys', () => {
  it('remaps lowercase row keys to match uppercase attributeName casing', () => {
    const metadata = [makeMeta('LICENSENAME'), makeMeta('OWNERNAME')];
    const rows = [{ licensename: 'Business License', ownername: 'Jane Doe' }];

    const result = normalizeRowDataKeys(rows, metadata);

    expect(result[0]).toEqual({ LICENSENAME: 'Business License', OWNERNAME: 'Jane Doe' });
  });

  it('leaves already-matching keys unchanged', () => {
    const metadata = [makeMeta('LICENSENAME')];
    const rows = [{ LICENSENAME: 'Business License' }];

    const result = normalizeRowDataKeys(rows, metadata);

    expect(result[0]).toEqual({ LICENSENAME: 'Business License' });
  });

  it('keeps a row key as-is when no matching attributeName exists', () => {
    const metadata = [makeMeta('LICENSENAME')];
    const rows = [{ licensename: 'Business License', __rowId: 'abc123' }];

    const result = normalizeRowDataKeys(rows, metadata);

    expect(result[0]).toEqual({ LICENSENAME: 'Business License', __rowId: 'abc123' });
  });

  it('handles an empty rows array', () => {
    expect(normalizeRowDataKeys([], [makeMeta('LICENSENAME')])).toEqual([]);
  });
});
