/**
 * The confirmed, standard shape of one attribute's metadata as returned by
 * the API. This is the library's canonical input type — consuming
 * applications pass their API's attributeMetaData array through as-is
 * (after normal JSON parsing), with no adapter step required, since this
 * shape has been confirmed as the standard contract rather than a
 * one-off sample.
 *
 * Note on `attributeName` vs `attributeDisplayName`:
 * - `attributeDisplayName` is shown to the user verbatim (ColDef.headerName).
 * - `attributeName` is used for all internal matching (ColDef.field/colId,
 *   and for matching keys in ColumnBehaviorConfig), compared
 *   case-insensitively wherever the library looks it up by key — see
 *   `normalizeKey` in `../utilities/key-normalizer`.
 */
export interface AttributeMetadata {
  attributeId: number;
  attributeName: string;
  objectType: string;
  filterValue1: string;
  filterValue2: string;
  filterOperator1: string;
  filterOperator2: string;
  columnSortOrder: number;
  sortType: string;
  attributeDisplayName: string;
  isGeneralAttribute: boolean;
  isIndustryAttribute: boolean;
  isCustomerAttribute: boolean;
  dataSource: string;
  isHidden: boolean;
  isActionable: boolean;
  actionType: string;
  referenceAttribute: string;
  attributeDataType: string;
  columnWidth: number;
  isFreezable: boolean;
  isFilterable: boolean;
  isSortable: boolean;
  abbrvAttDisplayName: string;
  isValueList: boolean;
}
