import { describe, it, expect, vi } from 'vitest';
import { DataTypeFilterRegistry } from './filter-registry';
import { DEFAULT_FILTER_MAP } from './default-filter-map';

describe('DataTypeFilterRegistry', () => {
  it('resolves each default data type to its expected filter', () => {
    const registry = new DataTypeFilterRegistry(DEFAULT_FILTER_MAP);

    expect(registry.resolve('STRING')).toBe('agTextColumnFilter');
    expect(registry.resolve('TEXT')).toBe('agTextColumnFilter');
    expect(registry.resolve('DATE')).toBe('agDateColumnFilter');
    expect(registry.resolve('DATETIME')).toBe('agDateColumnFilter');
    expect(registry.resolve('NUMBER')).toBe('agNumberColumnFilter');
    expect(registry.resolve('NUMERIC')).toBe('agNumberColumnFilter');
    expect(registry.resolve('INTEGER')).toBe('agNumberColumnFilter');
    expect(registry.resolve('IMAGE')).toBe(false);
  });

  it('is case-insensitive when resolving', () => {
    const registry = new DataTypeFilterRegistry(DEFAULT_FILTER_MAP);
    expect(registry.resolve('string')).toBe('agTextColumnFilter');
    expect(registry.resolve('Date')).toBe('agDateColumnFilter');
  });

  it('falls back to agTextColumnFilter for unrecognized types', () => {
    const registry = new DataTypeFilterRegistry(DEFAULT_FILTER_MAP);
    expect(registry.resolve('SOME_UNKNOWN_TYPE')).toBe('agTextColumnFilter');
  });

  it('never throws for null or undefined data types', () => {
    const registry = new DataTypeFilterRegistry(DEFAULT_FILTER_MAP);
    expect(() => registry.resolve(null)).not.toThrow();
    expect(() => registry.resolve(undefined)).not.toThrow();
    expect(registry.resolve(null)).toBe('agTextColumnFilter');
    expect(registry.resolve(undefined)).toBe('agTextColumnFilter');
  });

  it('allows registering additional or overriding filter types', () => {
    const registry = new DataTypeFilterRegistry(DEFAULT_FILTER_MAP);
    registry.register('VALUE LIST', 'customValueListFilter');
    expect(registry.resolve('VALUE LIST')).toBe('customValueListFilter');
    expect(registry.resolve('value list')).toBe('customValueListFilter');
  });

  it('works with no initial map at all', () => {
    const registry = new DataTypeFilterRegistry();
    expect(registry.resolve('STRING')).toBe('agTextColumnFilter');
  });
});
