import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNonprofitOnboardingFields1761500000000 implements MigrationInterface {
  name = 'AddNonprofitOnboardingFields1761500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add first_name and last_name for contact person
    await queryRunner.query(
      `ALTER TABLE "nonprofit_orgs" ADD "first_name" varchar(100)`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "nonprofit_orgs"."first_name" IS 'First name of the primary contact person'`
    );
    await queryRunner.query(
      `ALTER TABLE "nonprofit_orgs" ADD "last_name" varchar(100)`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "nonprofit_orgs"."last_name" IS 'Last name of the primary contact person'`
    );

    // Add bio field (organization description, separate from mission)
    await queryRunner.query(
      `ALTER TABLE "nonprofit_orgs" ADD "bio" text`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "nonprofit_orgs"."bio" IS 'Organization description/bio (2-3 paragraphs about what they do, who they serve, impact made)'`
    );

    // Add position field (role/position of contact person in the organization)
    await queryRunner.query(
      `ALTER TABLE "nonprofit_orgs" ADD "position" varchar(128)`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "nonprofit_orgs"."position" IS 'Position/role of the contact person in the organization (e.g., Executive Director, Program Manager)'`
    );

    // Add registration_number field (official registration number)
    await queryRunner.query(
      `ALTER TABLE "nonprofit_orgs" ADD "registration_number" varchar(128)`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "nonprofit_orgs"."registration_number" IS 'Official registration/incorporation number'`
    );

    // Add required_skills field (JSONB array of skills the org is looking for)
    await queryRunner.query(
      `ALTER TABLE "nonprofit_orgs" ADD "required_skills" jsonb`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "nonprofit_orgs"."required_skills" IS 'Array of skills the organization is looking for in volunteers/applicants'`
    );

    // Add social_media_links field (JSONB object with social media URLs)
    await queryRunner.query(
      `ALTER TABLE "nonprofit_orgs" ADD "social_media_links" jsonb`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "nonprofit_orgs"."social_media_links" IS 'Social media profile URLs (LinkedIn, Twitter, Facebook, Instagram, etc.)'`
    );

    // Create indexes for better query performance
    await queryRunner.query(
      `CREATE INDEX "IDX_nonprofit_orgs_required_skills" ON "nonprofit_orgs" USING GIN ("required_skills")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_nonprofit_orgs_social_media" ON "nonprofit_orgs" USING GIN ("social_media_links")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "public"."IDX_nonprofit_orgs_social_media"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_nonprofit_orgs_required_skills"`);

    // Drop columns
    await queryRunner.query(`ALTER TABLE "nonprofit_orgs" DROP COLUMN "social_media_links"`);
    await queryRunner.query(`ALTER TABLE "nonprofit_orgs" DROP COLUMN "required_skills"`);
    await queryRunner.query(`ALTER TABLE "nonprofit_orgs" DROP COLUMN "registration_number"`);
    await queryRunner.query(`ALTER TABLE "nonprofit_orgs" DROP COLUMN "position"`);
    await queryRunner.query(`ALTER TABLE "nonprofit_orgs" DROP COLUMN "bio"`);
    await queryRunner.query(`ALTER TABLE "nonprofit_orgs" DROP COLUMN "last_name"`);
    await queryRunner.query(`ALTER TABLE "nonprofit_orgs" DROP COLUMN "first_name"`);
  }
}

