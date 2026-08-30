/**
 * Normalizes an attribute name for case-insensitive lookups (behavior
 * config keys, renderer/filter registries). This is used ONLY for
 * matching/lookup purposes — it must never be used to derive ColDef.field
 * or ColDef.colId, which must preserve the exact attributeName casing so
 * they continue to match the row data's own key casing.
 */
export function normalizeKey(name: string): string {
  return name.trim().toUpperCase();
}
