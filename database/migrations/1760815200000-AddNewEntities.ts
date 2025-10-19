import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewEntities1760815200000 implements MigrationInterface {
  name = 'AddNewEntities1760815200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add email_verification_token column to users table
    await queryRunner.query(`ALTER TABLE "users" ADD "email_verification_token" character varying(255)`);

    // Create saved_jobs table
    await queryRunner.query(`
      CREATE TABLE "saved_jobs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "job_id" uuid NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_saved_jobs_user_job" UNIQUE ("user_id", "job_id"),
        CONSTRAINT "PK_saved_jobs" PRIMARY KEY ("id")
      )
    `);

    // Create notifications table
    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "type" character varying(50) NOT NULL,
        "title" character varying(255) NOT NULL,
        "body" text NOT NULL,
        "data" jsonb,
        "read_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notifications" PRIMARY KEY ("id")
      )
    `);

    // Create notification_preferences table
    await queryRunner.query(`
      CREATE TABLE "notification_preferences" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "email_enabled" boolean NOT NULL DEFAULT true,
        "email_job_matches" boolean NOT NULL DEFAULT true,
        "email_application_updates" boolean NOT NULL DEFAULT true,
        "email_interviews" boolean NOT NULL DEFAULT true,
        "email_messages" boolean NOT NULL DEFAULT true,
        "email_system" boolean NOT NULL DEFAULT true,
        "push_enabled" boolean NOT NULL DEFAULT true,
        "push_job_matches" boolean NOT NULL DEFAULT true,
        "push_application_updates" boolean NOT NULL DEFAULT true,
        "push_interviews" boolean NOT NULL DEFAULT true,
        "push_messages" boolean NOT NULL DEFAULT true,
        "push_system" boolean NOT NULL DEFAULT true,
        "sms_enabled" boolean NOT NULL DEFAULT false,
        "sms_job_matches" boolean NOT NULL DEFAULT false,
        "sms_application_updates" boolean NOT NULL DEFAULT false,
        "sms_interviews" boolean NOT NULL DEFAULT true,
        "sms_messages" boolean NOT NULL DEFAULT false,
        "sms_system" boolean NOT NULL DEFAULT false,
        "reminders_enabled" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_notification_preferences_user" UNIQUE ("user_id"),
        CONSTRAINT "PK_notification_preferences" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "saved_jobs" 
      ADD CONSTRAINT "FK_saved_jobs_user" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "saved_jobs" 
      ADD CONSTRAINT "FK_saved_jobs_job" 
      FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "notifications" 
      ADD CONSTRAINT "FK_notifications_user" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "notification_preferences" 
      ADD CONSTRAINT "FK_notification_preferences_user" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX "IDX_saved_jobs_user" ON "saved_jobs" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_saved_jobs_job" ON "saved_jobs" ("job_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_notifications_user" ON "notifications" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_notifications_type" ON "notifications" ("type")`);
    await queryRunner.query(`CREATE INDEX "IDX_notifications_created_at" ON "notifications" ("created_at")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_notifications_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_notifications_type"`);
    await queryRunner.query(`DROP INDEX "IDX_notifications_user"`);
    await queryRunner.query(`DROP INDEX "IDX_saved_jobs_job"`);
    await queryRunner.query(`DROP INDEX "IDX_saved_jobs_user"`);

    // Drop foreign key constraints
    await queryRunner.query(`ALTER TABLE "notification_preferences" DROP CONSTRAINT "FK_notification_preferences_user"`);
    await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_notifications_user"`);
    await queryRunner.query(`ALTER TABLE "saved_jobs" DROP CONSTRAINT "FK_saved_jobs_job"`);
    await queryRunner.query(`ALTER TABLE "saved_jobs" DROP CONSTRAINT "FK_saved_jobs_user"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "notification_preferences"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "saved_jobs"`);

    // Remove columns
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email_verification_token"`);
  }
}
