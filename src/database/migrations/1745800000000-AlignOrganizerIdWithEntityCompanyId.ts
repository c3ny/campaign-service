import { MigrationInterface, QueryRunner } from 'typeorm';
import { loadIdMapping } from '../migrations-helpers/id-mapping';

/**
 * Aligns campaigns.organizerId with the entity company.id (matches the JWT
 * claim `companyId` issued by users-service after the enrichUserWithJwtClaims
 * fix in the frontend).
 *
 * Before the fix, the frontend's /campanhas/criar page passed `user.id` as
 * organizerId — so historic campaigns reference the users.id, not the entity
 * company.id. This migration repoints them.
 *
 * Idempotent: re-running on already-aligned rows is a no-op (UPDATE 0).
 */
export class AlignOrganizerIdWithEntityCompanyId1745800000000
  implements MigrationInterface
{
  name = 'AlignOrganizerIdWithEntityCompanyId1745800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const mapping = loadIdMapping();
    for (const { from, to } of mapping) {
      await queryRunner.query(
        `UPDATE "campaigns" SET "organizerId" = $1 WHERE "organizerId" = $2`,
        [to, from],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const mapping = loadIdMapping();
    for (const { from, to } of mapping) {
      await queryRunner.query(
        `UPDATE "campaigns" SET "organizerId" = $1 WHERE "organizerId" = $2`,
        [from, to],
      );
    }
  }
}
