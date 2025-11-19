import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * @class AddGranularPrivacyCategories1762004000000
 * @description Adds granular privacy category fields to applicant_profiles table
 * to allow users to control which specific data categories can be used for AI recommendations.
 */
export class AddGranularPrivacyCategories1762004000000 implements MigrationInterface {
  name = 'AddGranularPrivacyCategories1762004000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add granular privacy category columns to applicant_profiles
    await queryRunner.query(`
      ALTER TABLE "applicant_profiles" 
      ADD COLUMN "allow_personal_information" boolean NOT NULL DEFAULT true,
      ADD COLUMN "allow_gender_data" boolean NOT NULL DEFAULT true,
      ADD COLUMN "allow_location" boolean NOT NULL DEFAULT true,
      ADD COLUMN "allow_experience" boolean NOT NULL DEFAULT true,
      ADD COLUMN "allow_skills" boolean NOT NULL DEFAULT true,
      ADD COLUMN "allow_certificates" boolean NOT NULL DEFAULT true,
      ADD COLUMN "allow_bio" boolean NOT NULL DEFAULT true;
    `);

    // Add comments for documentation
    await queryRunner.query(`
      COMMENT ON COLUMN "applicant_profiles"."allow_personal_information" IS 'Allow personal information (name, email, phone) to be used for AI recommendations';
      COMMENT ON COLUMN "applicant_profiles"."allow_gender_data" IS 'Allow gender data to be used for AI recommendations';
      COMMENT ON COLUMN "applicant_profiles"."allow_location" IS 'Allow location data (country, state, city) to be used for AI recommendations';
      COMMENT ON COLUMN "applicant_profiles"."allow_experience" IS 'Allow work experience data to be used for AI recommendations';
      COMMENT ON COLUMN "applicant_profiles"."allow_skills" IS 'Allow skills data to be used for AI recommendations';
      COMMENT ON COLUMN "applicant_profiles"."allow_certificates" IS 'Allow certificates data to be used for AI recommendations';
      COMMENT ON COLUMN "applicant_profiles"."allow_bio" IS 'Allow bio/profile description to be used for AI recommendations';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove granular privacy category columns
    await queryRunner.query(`
      ALTER TABLE "applicant_profiles" 
      DROP COLUMN "allow_bio",
      DROP COLUMN "allow_certificates",
      DROP COLUMN "allow_skills",
      DROP COLUMN "allow_experience",
      DROP COLUMN "allow_location",
      DROP COLUMN "allow_gender_data",
      DROP COLUMN "allow_personal_information";
    `);
  }
}









