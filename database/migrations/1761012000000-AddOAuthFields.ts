import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOAuthFields1761012000000 implements MigrationInterface {
  name = 'AddOAuthFields1761012000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add OAuth provider fields to users table
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "oauth_provider" character varying(50),
      ADD COLUMN "oauth_id" character varying(255),
      ADD COLUMN "oauth_profile" jsonb;
    `);

    // Create unique index on oauth_provider and oauth_id combination
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_users_oauth_provider_id" 
      ON "users" ("oauth_provider", "oauth_id") 
      WHERE "oauth_provider" IS NOT NULL AND "oauth_id" IS NOT NULL;
    `);

    // Make password_hash nullable since OAuth users don't need passwords
    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "password_hash" DROP NOT NULL;
    `);

    // Add comments for documentation
    await queryRunner.query(`
      COMMENT ON COLUMN "users"."oauth_provider" IS 'OAuth provider name (google, linkedin, etc.)';
      COMMENT ON COLUMN "users"."oauth_id" IS 'Unique identifier from OAuth provider';
      COMMENT ON COLUMN "users"."oauth_profile" IS 'Raw OAuth profile data from provider';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the unique index
    await queryRunner.query(`
      DROP INDEX "IDX_users_oauth_provider_id";
    `);

    // Remove OAuth columns
    await queryRunner.query(`
      ALTER TABLE "users" 
      DROP COLUMN "oauth_profile",
      DROP COLUMN "oauth_id",
      DROP COLUMN "oauth_provider";
    `);

    // Make password_hash NOT NULL again (this might fail if there are OAuth users)
    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "password_hash" SET NOT NULL;
    `);
  }
}



