import type { FilterResolver } from './filter-registry';

/**
 * Baseline, Community-only filter mapping shipped in V1. Advanced filter
 * behavior (pre-seeding filter state from filterValue1/2 + filterOperator1/2,
 * and Enterprise filters as *default* entries) is deferred to a future
 * release — apps already using AG Grid Enterprise can register those
 * filters themselves via DataTypeFilterRegistry.register() today.
 */
export const DEFAULT_FILTER_MAP: Record<string, FilterResolver> = {
  STRING: 'agTextColumnFilter',
  TEXT: 'agTextColumnFilter',
  DATE: 'agDateColumnFilter',
  DATETIME: 'agDateColumnFilter',
  NUMBER: 'agNumberColumnFilter',
  NUMERIC: 'agNumberColumnFilter',
  INTEGER: 'agNumberColumnFilter',
  IMAGE: false,
};
