import type { AttributeMetadata } from '../models/attribute-metadata.model';
import type { MetadataColDef } from '../models/grid-column-def.model';
import { DataTypeFilterRegistry } from '../filters/filter-registry';
import { DEFAULT_FILTER_MAP } from '../filters/default-filter-map';
import { createInfoIconHeaderRenderer } from '../behaviors/header-info.renderer';
import { createAnchorLinkRenderer } from '../behaviors/anchor-link.renderer';
import { createIconCellRenderer } from '../behaviors/icon-cell.renderer';
import { normalizeKey } from '../utilities/key-normalizer';
import type { ColumnBehaviorConfig } from '../behaviors/behavior.types';
import type { ColumnBuilderOptions } from './column-builder.types';

function buildNormalizedBehaviorMap(
  columnBehaviors: Record<string, ColumnBehaviorConfig> | undefined,
): Map<string, ColumnBehaviorConfig> {
  const map = new Map<string, ColumnBehaviorConfig>();
  if (columnBehaviors) {
    Object.entries(columnBehaviors).forEach(([key, config]) => map.set(normalizeKey(key), config));
  }
  return map;
}

/**
 * Generates AG Grid ColDef[] from an array of attribute metadata.
 *
 * - headerName is set verbatim from attributeDisplayName (shown to the
 *   user as-is).
 * - field/colId/sourceAttributeName are set verbatim from attributeName
 *   (must match the row data's own key casing — see
 *   utilities/row-data-key-normalizer.ts if that casing doesn't already
 *   align).
 * - Behavior config lookups (columnBehaviors keys) are matched against
 *   attributeName case-insensitively, so the app doesn't need to match
 *   the API's exact casing when writing its config.
 * - Hidden columns (isHidden === true) are excluded entirely.
 * - Column ordering is NOT applied by this function — sorting the
 *   resulting array (if needed at all) is the consuming app's concern;
 *   AG Grid's own column ordering/sorting works after render regardless.
 */
export function buildColumnDefs(
  attributeMetadata: AttributeMetadata[],
  options?: ColumnBuilderOptions,
): MetadataColDef[] {
  const filterRegistry = options?.filterRegistry ?? new DataTypeFilterRegistry(DEFAULT_FILTER_MAP);
  const behaviorMap = buildNormalizedBehaviorMap(options?.columnBehaviors);

  return attributeMetadata
    .filter((meta) => !meta.isHidden)
    .map((meta): MetadataColDef => {
      const behavior = behaviorMap.get(normalizeKey(meta.attributeName));

      if (behavior?.toggle) {
        throw new Error(
          `ngx-ag-grid-metadata: toggle behavior ("${meta.attributeName}") is not yet implemented in this ` +
            'release — planned for a future release. Remove it from columnBehaviors to proceed.',
        );
      }

      let colDef: MetadataColDef = {
        sourceAttributeName: meta.attributeName,
        colId: meta.attributeName,
        field: meta.attributeName,
        headerName: meta.attributeDisplayName || meta.abbrvAttDisplayName,
        headerTooltip: meta.attributeDisplayName,
        sortable: meta.isSortable ?? true,
        filter: meta.isFilterable ? filterRegistry.resolve(meta.attributeDataType) : false,
        width: meta.columnWidth || undefined,
        pinned: meta.isFreezable ? 'left' : undefined,
      };

      if (behavior?.headerInfo) {
        colDef = {
          ...colDef,
          headerComponent: createInfoIconHeaderRenderer(behavior.headerInfo, meta),
        };
      }

      if (behavior?.anchorLink) {
        colDef = { ...colDef, cellRenderer: createAnchorLinkRenderer(behavior.anchorLink) };
      } else if (behavior?.icon) {
        colDef = { ...colDef, cellRenderer: createIconCellRenderer(behavior.icon) };
      }

      return options?.postProcess ? options.postProcess(colDef, meta) : colDef;
    });
}
