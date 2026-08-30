/*
 * Public API Surface of ngx-ag-grid-metadata
 */

// Column building
export { buildColumnDefs } from './lib/column-builder/column-builder';
export type { ColumnBuilderOptions, ColumnPostProcessor } from './lib/column-builder/column-builder.types';

// Filters
export { DataTypeFilterRegistry, DEFAULT_FILTER_MAP } from './lib/filters';
export type { FilterResolver } from './lib/filters';

// Behaviors
export {
  createInfoIconHeaderRenderer,
  createAnchorLinkRenderer,
  createIconCellRenderer,
} from './lib/behaviors';
export type {
  ColumnBehaviorConfig,
  HeaderInfoConfig,
  AnchorLinkConfig,
  IconConfig,
  ToggleConfig,
} from './lib/behaviors';

// Models
export type { AttributeMetadata, MetadataColDef } from './lib/models';

// Utilities
export { normalizeRowDataKeys } from './lib/utilities/row-data-key-normalizer';
