import type { AttributeMetadata } from '../models/attribute-metadata.model';

export interface HeaderInfoConfig {
  /** Static string, or computed per-column from that column's own metadata. */
  tooltip: string | ((meta: AttributeMetadata) => string);
  /** Optional icon class override; the library ships a default via CSS. */
  iconClass?: string;
}

export interface AnchorLinkConfig<TRow = Record<string, unknown>> {
  /** If omitted, the anchor always renders. If false, plain text renders instead. */
  condition?: (row: TRow) => boolean;
  /** Called with the full row object and the column's field name on activation. */
  onClick: (row: TRow, columnField: string) => void;
  /** Optional override for the displayed text; defaults to the cell's own value. */
  displayValue?: (row: TRow) => string;
}

export interface IconConfig<TRow = Record<string, unknown>> {
  /** Resolves which icon class to show for this row; null/undefined shows no icon. */
  resolve: (row: TRow) => string | null | undefined;
  /** Where the icon appears relative to the cell's text value. Defaults to 'before'. */
  position?: 'before' | 'after' | 'replace';
  /** Optional click handling — omit for a purely decorative icon. */
  onClick?: (row: TRow) => void;
  /** Optional per-row tooltip for the icon itself. */
  tooltip?: (row: TRow) => string | undefined;
}

/**
 * Reserved for a future release. Accepted by the type system now so that
 * adding real toggle support later is additive rather than a breaking
 * change, but buildColumnDefs() throws a clear development-time error if
 * this is actually supplied in the current release — see column-builder.ts.
 */
export interface ToggleConfig<TRow = Record<string, unknown>> {
  getValue: (row: TRow) => boolean;
  onChange: (newValue: boolean, row: TRow) => void | boolean | Promise<boolean>;
  disabled?: (row: TRow) => boolean;
}

export interface ColumnBehaviorConfig<TRow = Record<string, unknown>> {
  headerInfo?: HeaderInfoConfig;
  anchorLink?: AnchorLinkConfig<TRow>;
  icon?: IconConfig<TRow>;
  /** Reserved — not implemented in this release. See ToggleConfig's doc comment. */
  toggle?: ToggleConfig<TRow>;
}
