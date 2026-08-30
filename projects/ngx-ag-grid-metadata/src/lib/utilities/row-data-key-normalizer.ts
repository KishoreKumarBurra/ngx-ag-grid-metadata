import type { AttributeMetadata } from '../models/attribute-metadata.model';
import { normalizeKey } from './key-normalizer';

/**
 * Remaps each row's keys to match the casing of `attributeName` in the
 * supplied metadata, so that ColDef.field (which is set verbatim from
 * attributeName) lines up with the row data AG Grid actually reads from.
 *
 * This is optional — only needed when the row data's own key casing does
 * not already match attributeName's casing (a case mismatch has been
 * observed between metadata, e.g. "LICENSENAME", and row data, e.g.
 * "licensename", in at least one API response). If a consuming app's row
 * data already matches, this is a no-op pass-through for every key.
 *
 * Any row key with no corresponding attributeName (case-insensitively) is
 * kept as-is, so this never silently drops data the caller didn't expect
 * to lose.
 */
export function normalizeRowDataKeys<T extends Record<string, unknown>>(
  rows: T[],
  attributeMetadata: AttributeMetadata[],
): Record<string, unknown>[] {
  const canonicalKeyByNormalized = new Map<string, string>(
    attributeMetadata.map((meta) => [normalizeKey(meta.attributeName), meta.attributeName]),
  );

  return rows.map((row) =>
    Object.keys(row).reduce<Record<string, unknown>>((accumulator, rawKey) => {
      const canonicalKey = canonicalKeyByNormalized.get(normalizeKey(rawKey)) ?? rawKey;
      accumulator[canonicalKey] = row[rawKey];
      return accumulator;
    }, {}),
  );
}
