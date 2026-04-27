/**
 * Maps `users.id` (legacy organizerId) → `company.id` (entity organizerId).
 *
 * Reads `ENTITY_COMPANY_MAPPING_JSON` env var, format:
 *   `[{"from":"<users.id>","to":"<company.id>"},...]`
 *
 * Falls back to a hardcoded mapping known from the dev environment so the
 * migration is safe to re-run in environments where the env var is missing
 * (idempotent: rows already aligned won't be re-updated).
 *
 * To generate the mapping for a fresh environment, run this SQL against the
 * users-service database:
 *   SELECT u.id AS from, c.id AS to
 *   FROM users u JOIN company c ON c.fk_user_id = u.id
 *   WHERE u.person_type = 'COMPANY';
 *
 * See `docs/migrations/align-ids.md` for full deployment instructions.
 */
export interface IdMapping {
  from: string;
  to: string;
}

const HARDCODED_FALLBACK: IdMapping[] = [
  {
    from: '5ebc040a-3753-478e-8324-26ed94693514',
    to: 'f92b0166-597b-4fb2-89e1-600981a5ee8b',
  },
];

export function loadIdMapping(): IdMapping[] {
  const raw = process.env.ENTITY_COMPANY_MAPPING_JSON;
  if (!raw) return HARDCODED_FALLBACK;
  try {
    const parsed = JSON.parse(raw) as IdMapping[];
    if (!Array.isArray(parsed)) return HARDCODED_FALLBACK;
    return parsed.filter(
      (m) => typeof m?.from === 'string' && typeof m?.to === 'string',
    );
  } catch {
    return HARDCODED_FALLBACK;
  }
}
