/**
 * The value AG Grid's ColDef.filter accepts: a built-in filter name
 * (string), false to disable filtering, or a custom filter component.
 */
export type FilterResolver = string | boolean | unknown;

/**
 * Maps an attributeDataType string to the AG Grid filter to use for that
 * type. Ships with DEFAULT_FILTER_MAP covering the baseline Community
 * filter types; consuming apps register additional types (custom value-list
 * filters, Enterprise filters, etc.) without needing to fork the library.
 *
 * resolve() never throws — a missing/unrecognized/null/undefined data type
 * falls through to a safe default (agTextColumnFilter), matching the
 * existing dashboard's documented behavior: a bad or absent data type must
 * not crash column generation for the rest of the grid.
 */
export class DataTypeFilterRegistry {
  private readonly map = new Map<string, FilterResolver>();

  constructor(initial?: Record<string, FilterResolver>) {
    if (initial) {
      Object.entries(initial).forEach(([dataType, filter]) => this.register(dataType, filter));
    }
  }

  register(dataType: string, filter: FilterResolver): void {
    this.map.set(dataType.trim().toUpperCase(), filter);
  }

  resolve(dataType: string | undefined | null): FilterResolver {
    return this.map.get((dataType ?? '').trim().toUpperCase()) ?? 'agTextColumnFilter';
  }
}
