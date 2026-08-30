# ngx-ag-grid-metadata

Metadata-driven AG Grid column generation for Angular. Turns your API's `attributeMetaData` response into ready-to-use AG Grid `ColDef[]` — with dynamic headers, data-type-based filters, and configurable header-info, anchor-link, and icon cell behaviors — without writing renderer code per column.

**Requires:** Angular 21+, `ag-grid-community` 35+.

## Install

```bash
npm install ngx-ag-grid-metadata ag-grid-community
```

## Quick start

```typescript
import { buildColumnDefs } from 'ngx-ag-grid-metadata';

const columnDefs = buildColumnDefs(response.attributeMetaData);

gridApi.setGridOption('columnDefs', columnDefs);
```

This alone gives you, per column:
- `headerName` from `attributeDisplayName`
- `field`/`colId` from `attributeName`
- `filter` resolved from `attributeDataType` (`STRING`/`TEXT` → text filter, `DATE`/`DATETIME` → date filter, `NUMBER`/`NUMERIC`/`INTEGER` → number filter, `IMAGE` → no filter)
- `sortable`, `pinned` from `isSortable`/`isFreezable`
- hidden columns (`isHidden: true`) excluded entirely

## Row data key casing

`field` is set from `attributeName` verbatim. If your row data's keys don't already match that casing (e.g. metadata says `LICENSENAME` but rows have `licensename`), normalize once before handing rows to AG Grid:

```typescript
import { normalizeRowDataKeys } from 'ngx-ag-grid-metadata';

const rowData = normalizeRowDataKeys(response.data, response.attributeMetaData);
```

## Custom filters

```typescript
import { buildColumnDefs, DataTypeFilterRegistry, DEFAULT_FILTER_MAP } from 'ngx-ag-grid-metadata';

const filterRegistry = new DataTypeFilterRegistry(DEFAULT_FILTER_MAP);
filterRegistry.register('VALUE LIST', MyValueListFilterComponent);
filterRegistry.register('STATIC VALUE LIST', MyValueListFilterComponent);

const columnDefs = buildColumnDefs(response.attributeMetaData, { filterRegistry });
```

## Header info icon + tooltip

```typescript
buildColumnDefs(response.attributeMetaData, {
  columnBehaviors: {
    ORDERSTATUS: {
      headerInfo: { tooltip: 'Status is refreshed every 24 hours from the source system.' },
    },
  },
});
```

## Anchor links (unconditional and conditional)

```typescript
buildColumnDefs(response.attributeMetaData, {
  columnBehaviors: {
    LICENSENAME: {
      anchorLink: {
        // omit `condition` for an always-on link
        onClick: (row) => openLicenseDetails(row['licenseid']),
      },
    },
    OWNERNAME: {
      anchorLink: {
        condition: (row) => row['licenseownerid'] != null,
        onClick: (row) => openOwnerDetails(row['licenseownerid']),
      },
    },
  },
});
```

`onClick` receives the full row object and the column's field name. Keyboard activation (Enter/Space) is wired automatically alongside click.

## Icon cells

```typescript
buildColumnDefs(response.attributeMetaData, {
  columnBehaviors: {
    ORDERSTATUS: {
      icon: {
        resolve: (row) => (row['orderstatus'] === 'Completed' ? 'icon-check-circle' : 'icon-clock'),
        position: 'before', // 'before' | 'after' | 'replace'
        tooltip: (row) => row['orderstatus'],
      },
    },
  },
});
```

The library renders `<span class="ngx-agm-cell-icon {your-class}">` — it ships no icon assets itself. Supply the actual glyph via your own icon font/SVG CSS.

## Escape hatch for anything else

```typescript
buildColumnDefs(response.attributeMetaData, {
  postProcess: (colDef, meta) => {
    if (meta.attributeName === 'SOMETHING_SPECIFIC') {
      return { ...colDef, cellClass: 'my-special-class' };
    }
    return colDef;
  },
});
```

## Not yet supported

Toggle-button cells are reserved in the type system (`ColumnBehaviorConfig.toggle`) but not implemented in this release — passing one throws a clear error at build time rather than silently doing nothing.

## API Reference

| Export | Purpose |
|---|---|
| `buildColumnDefs(metadata, options?)` | Main entry point — metadata in, `ColDef[]` out |
| `DataTypeFilterRegistry` | Register custom filters per `attributeDataType` |
| `DEFAULT_FILTER_MAP` | The library's baseline Community filter mapping |
| `createInfoIconHeaderRenderer` / `createAnchorLinkRenderer` / `createIconCellRenderer` | The individual renderer factories, usable standalone outside `buildColumnDefs()` |
| `normalizeRowDataKeys(rows, metadata)` | Reconciles row data key casing with `attributeName` casing |
| `AttributeMetadata`, `MetadataColDef` | Core types |
