import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddApplicantProfileFields1761011000000 implements MigrationInterface {
  name = 'AddApplicantProfileFields1761011000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add missing columns to applicant_profiles table
    await queryRunner.query(`
      ALTER TABLE "applicant_profiles" 
      ADD COLUMN "skills" text[],
      ADD COLUMN "experience_level" character varying(50),
      ADD COLUMN "preferred_employment_type" character varying(50);
    `);

    // Add comments for documentation
    await queryRunner.query(`
      COMMENT ON COLUMN "applicant_profiles"."skills" IS 'Array of skills the applicant possesses';
      COMMENT ON COLUMN "applicant_profiles"."experience_level" IS 'Experience level: ENTRY, MID, SENIOR, or EXECUTIVE';
      COMMENT ON COLUMN "applicant_profiles"."preferred_employment_type" IS 'Preferred employment type: FULL_TIME, PART_TIME, CONTRACT, VOLUNTEER, or INTERNSHIP';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the added columns
    await queryRunner.query(`
      ALTER TABLE "applicant_profiles" 
      DROP COLUMN "preferred_employment_type",
      DROP COLUMN "experience_level",
      DROP COLUMN "skills";
    `);
  }
}



