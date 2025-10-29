import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * @class AddPrivacySettings1761013000000
 * @description Adds privacy settings fields to applicant_profiles table
 * to control AI model data usage and profile visibility.
 */
export class AddPrivacySettings1761013000000 implements MigrationInterface {
  name = 'AddPrivacySettings1761013000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add privacy settings columns to applicant_profiles
    await queryRunner.query(`
      ALTER TABLE "applicant_profiles" 
      ADD COLUMN "allow_ai_training" boolean NOT NULL DEFAULT true,
      ADD COLUMN "allow_profile_indexing" boolean NOT NULL DEFAULT true,
      ADD COLUMN "allow_data_analytics" boolean NOT NULL DEFAULT true,
      ADD COLUMN "allow_third_party_sharing" boolean NOT NULL DEFAULT false,
      ADD COLUMN "privacy_updated_at" TIMESTAMP WITH TIME ZONE;
    `);

    // Add comments for documentation
    await queryRunner.query(`
      COMMENT ON COLUMN "applicant_profiles"."allow_ai_training" IS 'Whether the applicant allows their data to be used for AI model training';
      COMMENT ON COLUMN "applicant_profiles"."allow_profile_indexing" IS 'Whether the applicant profile can be indexed and shown in search results';
      COMMENT ON COLUMN "applicant_profiles"."allow_data_analytics" IS 'Whether the applicant allows their data to be used for analytics and insights';
      COMMENT ON COLUMN "applicant_profiles"."allow_third_party_sharing" IS 'Whether the applicant allows their data to be shared with third-party partners';
      COMMENT ON COLUMN "applicant_profiles"."privacy_updated_at" IS 'Timestamp of the last privacy settings update';
    `);

    // Create index for privacy queries
    await queryRunner.query(`
      CREATE INDEX "IDX_applicant_profiles_privacy" 
      ON "applicant_profiles" ("allow_ai_training", "allow_profile_indexing");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the index
    await queryRunner.query(`
      DROP INDEX "IDX_applicant_profiles_privacy";
    `);

    // Remove privacy settings columns
    await queryRunner.query(`
      ALTER TABLE "applicant_profiles" 
      DROP COLUMN "privacy_updated_at",
      DROP COLUMN "allow_third_party_sharing",
      DROP COLUMN "allow_data_analytics",
      DROP COLUMN "allow_profile_indexing",
      DROP COLUMN "allow_ai_training";
    `);
  }
}



