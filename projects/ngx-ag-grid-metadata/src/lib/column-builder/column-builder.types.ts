import type { AttributeMetadata } from '../models/attribute-metadata.model';
import type { MetadataColDef } from '../models/grid-column-def.model';
import type { DataTypeFilterRegistry } from '../filters/filter-registry';
import type { ColumnBehaviorConfig } from '../behaviors/behavior.types';

/**
 * Called once per generated column, after the library's own defaults
 * (and any columnBehaviors) are applied — the escape hatch for one-off,
 * app-specific tweaks that don't fit headerInfo/anchorLink/icon.
 */
export type ColumnPostProcessor = (colDef: MetadataColDef, meta: AttributeMetadata) => MetadataColDef;

export interface ColumnBuilderOptions {
  /** Defaults to DEFAULT_FILTER_MAP when omitted. */
  filterRegistry?: DataTypeFilterRegistry;
  /** Declarative behaviors keyed by attributeName (case-insensitive). */
  columnBehaviors?: Record<string, ColumnBehaviorConfig>;
  /** Escape hatch for anything not covered by columnBehaviors. */
  postProcess?: ColumnPostProcessor;
}
