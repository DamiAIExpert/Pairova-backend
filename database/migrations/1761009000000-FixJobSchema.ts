import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixJobSchema1761009000000 implements MigrationInterface {
  name = 'FixJobSchema1761009000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, let's add the missing columns to the jobs table
    await queryRunner.query(`
      -- Add missing columns to jobs table
      ALTER TABLE "jobs" ADD COLUMN "org_user_id" uuid;
      ALTER TABLE "jobs" ADD COLUMN "experience_min_yrs" integer;
      ALTER TABLE "jobs" ADD COLUMN "experience_max_yrs" integer;
      ALTER TABLE "jobs" ADD COLUMN "experience_level" character varying(50);
      ALTER TABLE "jobs" ADD COLUMN "required_skills" text[];
      ALTER TABLE "jobs" ADD COLUMN "benefits" text[];
      ALTER TABLE "jobs" ADD COLUMN "deadline" TIMESTAMP WITH TIME ZONE;
      ALTER TABLE "jobs" ADD COLUMN "location_city" character varying(100);
      ALTER TABLE "jobs" ADD COLUMN "location_state" character varying(100);
      ALTER TABLE "jobs" ADD COLUMN "location_country" character varying(100);
      ALTER TABLE "jobs" ADD COLUMN "salary_min" numeric(14,2);
      ALTER TABLE "jobs" ADD COLUMN "salary_max" numeric(14,2);
      ALTER TABLE "jobs" ADD COLUMN "currency" character varying(16);
      ALTER TABLE "jobs" ADD COLUMN "created_by" uuid;
      ALTER TABLE "jobs" ADD COLUMN "published_at" TIMESTAMP WITH TIME ZONE;
    `);

    // Make placement and employment_type nullable to match entity
    await queryRunner.query(`
      ALTER TABLE "jobs" ALTER COLUMN "placement" DROP NOT NULL;
      ALTER TABLE "jobs" ALTER COLUMN "employment_type" DROP NOT NULL;
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "jobs" 
      ADD CONSTRAINT "FK_jobs_org_user" 
      FOREIGN KEY ("org_user_id") REFERENCES "nonprofit_orgs"("user_id") ON DELETE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE "jobs" 
      ADD CONSTRAINT "FK_jobs_created_by" 
      FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION;
    `);

    // Create indexes for better performance
    await queryRunner.query(`CREATE INDEX "IDX_jobs_org_user" ON "jobs" ("org_user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_jobs_created_by" ON "jobs" ("created_by")`);
    await queryRunner.query(`CREATE INDEX "IDX_jobs_status" ON "jobs" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_jobs_placement" ON "jobs" ("placement")`);
    await queryRunner.query(`CREATE INDEX "IDX_jobs_employment_type" ON "jobs" ("employment_type")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_jobs_employment_type"`);
    await queryRunner.query(`DROP INDEX "IDX_jobs_placement"`);
    await queryRunner.query(`DROP INDEX "IDX_jobs_status"`);
    await queryRunner.query(`DROP INDEX "IDX_jobs_created_by"`);
    await queryRunner.query(`DROP INDEX "IDX_jobs_org_user"`);

    // Drop foreign key constraints
    await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_jobs_created_by"`);
    await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_jobs_org_user"`);

    // Make columns NOT NULL again
    await queryRunner.query(`
      ALTER TABLE "jobs" ALTER COLUMN "employment_type" SET NOT NULL;
      ALTER TABLE "jobs" ALTER COLUMN "placement" SET NOT NULL;
    `);

    // Drop added columns
    await queryRunner.query(`
      ALTER TABLE "jobs" DROP COLUMN "published_at";
      ALTER TABLE "jobs" DROP COLUMN "created_by";
      ALTER TABLE "jobs" DROP COLUMN "currency";
      ALTER TABLE "jobs" DROP COLUMN "salary_max";
      ALTER TABLE "jobs" DROP COLUMN "salary_min";
      ALTER TABLE "jobs" DROP COLUMN "location_country";
      ALTER TABLE "jobs" DROP COLUMN "location_state";
      ALTER TABLE "jobs" DROP COLUMN "location_city";
      ALTER TABLE "jobs" DROP COLUMN "deadline";
      ALTER TABLE "jobs" DROP COLUMN "benefits";
      ALTER TABLE "jobs" DROP COLUMN "required_skills";
      ALTER TABLE "jobs" DROP COLUMN "experience_level";
      ALTER TABLE "jobs" DROP COLUMN "experience_max_yrs";
      ALTER TABLE "jobs" DROP COLUMN "experience_min_yrs";
      ALTER TABLE "jobs" DROP COLUMN "org_user_id";
    `);
  }
}

