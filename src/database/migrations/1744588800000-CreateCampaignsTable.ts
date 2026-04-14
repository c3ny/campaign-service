import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCampaignsTable1744588800000 implements MigrationInterface {
  name = 'CreateCampaignsTable1744588800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "campaign_status_enum" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "campaigns" (
        "id"                  uuid                    NOT NULL DEFAULT gen_random_uuid(),
        "title"               character varying(255)  NOT NULL,
        "description"         text,
        "bannerImage"         character varying,
        "startDate"           date                    NOT NULL,
        "endDate"             date                    NOT NULL,
        "bloodType"           character varying(10),
        "location"            jsonb                   NOT NULL,
        "organizerId"         uuid                    NOT NULL,
        "organizerName"       character varying(255)  NOT NULL,
        "organizerUsername"   character varying(255),
        "status"              "campaign_status_enum"  NOT NULL DEFAULT 'ACTIVE',
        "currentDonations"    integer                 NOT NULL DEFAULT 0,
        "targetDonations"     integer,
        "createdAt"           TIMESTAMP               NOT NULL DEFAULT now(),
        "updatedAt"           TIMESTAMP               NOT NULL DEFAULT now(),
        CONSTRAINT "PK_campaigns" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "campaigns"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "campaign_status_enum"`);
  }
}
