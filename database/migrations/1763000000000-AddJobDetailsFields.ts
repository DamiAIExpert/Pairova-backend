import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds additional job detail fields: hard_soft_skills, qualifications, responsibilities, mission_statement, postal_code
 */
export class AddJobDetailsFields1763000000000 implements MigrationInterface {
  name = 'AddJobDetailsFields1763000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if columns already exist before adding
    const hasHardSoftSkills = await queryRunner.hasColumn('jobs', 'hard_soft_skills');
    const hasQualifications = await queryRunner.hasColumn('jobs', 'qualifications');
    const hasResponsibilities = await queryRunner.hasColumn('jobs', 'responsibilities');
    const hasMissionStatement = await queryRunner.hasColumn('jobs', 'mission_statement');
    const hasPostalCode = await queryRunner.hasColumn('jobs', 'postal_code');

    if (!hasHardSoftSkills) {
      await queryRunner.query(`
        ALTER TABLE "jobs" ADD COLUMN "hard_soft_skills" text[];
      `);
    }

    if (!hasQualifications) {
      await queryRunner.query(`
        ALTER TABLE "jobs" ADD COLUMN "qualifications" text;
      `);
    }

    if (!hasResponsibilities) {
      await queryRunner.query(`
        ALTER TABLE "jobs" ADD COLUMN "responsibilities" text;
      `);
    }

    if (!hasMissionStatement) {
      await queryRunner.query(`
        ALTER TABLE "jobs" ADD COLUMN "mission_statement" text;
      `);
    }

    if (!hasPostalCode) {
      await queryRunner.query(`
        ALTER TABLE "jobs" ADD COLUMN "postal_code" character varying(20);
      `);
    }

    console.log('✅ Added job detail fields to jobs table');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasHardSoftSkills = await queryRunner.hasColumn('jobs', 'hard_soft_skills');
    const hasQualifications = await queryRunner.hasColumn('jobs', 'qualifications');
    const hasResponsibilities = await queryRunner.hasColumn('jobs', 'responsibilities');
    const hasMissionStatement = await queryRunner.hasColumn('jobs', 'mission_statement');
    const hasPostalCode = await queryRunner.hasColumn('jobs', 'postal_code');

    if (hasPostalCode) {
      await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "postal_code"`);
    }

    if (hasMissionStatement) {
      await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "mission_statement"`);
    }

    if (hasResponsibilities) {
      await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "responsibilities"`);
    }

    if (hasQualifications) {
      await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "qualifications"`);
    }

    if (hasHardSoftSkills) {
      await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "hard_soft_skills"`);
    }

    console.log('✅ Removed job detail fields from jobs table');
  }
}






