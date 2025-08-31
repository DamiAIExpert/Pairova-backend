// /database/migrations/1725057600000-InitialSchema.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * @class InitialSchema1725057600000
 * @description The first migration that sets up the entire initial database schema
 * for the Pairova application, including all tables, enums, indexes, and foreign keys.
 */
export class InitialSchema1725057600000 implements MigrationInterface {
  name = 'InitialSchema1725057600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`

      -- ENUMERATED TYPES
      CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'APPLICANT', 'NONPROFIT');
      CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE', 'OTHER', 'UNDISCLOSED');
      CREATE TYPE "public"."employment_type" AS ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'VOLUNTEER', 'INTERNSHIP');
      CREATE TYPE "public"."job_placement" AS ENUM('ONSITE', 'REMOTE', 'HYBRID');
      CREATE TYPE "public"."job_status" AS ENUM('DRAFT', 'PUBLISHED', 'PAUSED', 'CLOSED');
      CREATE TYPE "public"."application_status" AS ENUM('PENDING', 'UNDER_REVIEW', 'INTERVIEW', 'HIRED', 'DENIED', 'WITHDRAWN');
      CREATE TYPE "public"."message_type" AS ENUM('TEXT', 'FILE', 'SYSTEM');
      CREATE TYPE "public"."notification_type" AS ENUM('JOB_MATCH', 'APPLICATION_UPDATE', 'MESSAGE', 'INTERVIEW', 'SYSTEM');
      CREATE TYPE "public"."provider_type" AS ENUM('SMTP', 'SES', 'SENDGRID', 'MAILGUN');
      CREATE TYPE "public"."email_log_status" AS ENUM('SUCCESS', 'DENIED', 'FAILED');
      CREATE TYPE "public"."sms_provider" AS ENUM('TWILIO', 'AFRICASTALKING', 'NEXMO', 'TERMII');
      CREATE TYPE "public"."sms_status" AS ENUM('ACTIVE', 'INACTIVE');
      CREATE TYPE "public"."audit_action" AS ENUM('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'PUBLISH');
      CREATE TYPE "public"."page_type" AS ENUM('LANDING', 'ABOUT', 'SERVICES', 'HELP_CENTER', 'CUSTOM');
      CREATE TYPE "public"."policy_type" AS ENUM('TERMS', 'PRIVACY');
      CREATE TYPE "public"."channel_type" AS ENUM('EMAIL', 'IN_APP', 'SMS');
      CREATE TYPE "public"."otp_channel" AS ENUM('EMAIL', 'SMS', 'APP');

      -- USERS TABLE
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "role" "public"."user_role" NOT NULL,
        "email" character varying(255) NOT NULL,
        "password_hash" character varying(255),
        "phone" character varying(64),
        "is_verified" boolean NOT NULL DEFAULT false,
        "last_login_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      );

      COMMENT ON TABLE "users" IS 'role separates ADMIN / APPLICANT / NONPROFIT';

      -- APPLICANT PROFILES
      CREATE TABLE "applicant_profiles" (
        "user_id" uuid NOT NULL,
        "first_name" character varying(100),
        "last_name" character varying(100),
        "gender" "public"."gender",
        "dob" date,
        "bio" text,
        "country" character varying(100),
        "state" character varying(100),
        "city" character varying(100),
        "photo_url" text,
        "portfolio_url" text,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_applicant_profiles" PRIMARY KEY ("user_id")
      );

      -- NONPROFIT ORGS
      CREATE TABLE "nonprofit_orgs" (
        "user_id" uuid NOT NULL,
        "org_name" character varying(255) NOT NULL,
        "logo_url" text,
        "website" text,
        "mission" text,
        "values" text,
        "size_label" character varying(64),
        "org_type" character varying(64),
        "industry" character varying(128),
        "founded_on" date,
        "tax_id" character varying(128),
        "country" character varying(100),
        "state" character varying(100),
        "city" character varying(100),
        "address_line1" character varying(255),
        "address_line2" character varying(255),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_nonprofit_orgs" PRIMARY KEY ("user_id")
      );

      -- JOBS
      CREATE TABLE "jobs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying(255) NOT NULL,
        "description" text NOT NULL,
        "placement" "public"."job_placement" NOT NULL,
        "status" "public"."job_status" NOT NULL DEFAULT 'DRAFT',
        "employment_type" "public"."employment_type" NOT NULL,
        "posted_by_id" uuid NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_jobs" PRIMARY KEY ("id")
      );

      -- RECOMMENDATION SCORES
      CREATE TABLE "recommendation_scores" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "job_id" uuid NOT NULL,
        "applicant_id" uuid NOT NULL,
        "score" numeric(5,2),
        "score_details" jsonb,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_recommendation_scores" PRIMARY KEY ("id")
      );
      CREATE UNIQUE INDEX "IDX_recommendation_scores_job_applicant" ON "recommendation_scores" ("job_id", "applicant_id");

      -- FOREIGN KEYS
      ALTER TABLE "applicant_profiles" ADD CONSTRAINT "FK_applicant_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
      ALTER TABLE "nonprofit_orgs" ADD CONSTRAINT "FK_nonprofit_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
      ALTER TABLE "jobs" ADD CONSTRAINT "FK_job_posted_by" FOREIGN KEY ("posted_by_id") REFERENCES "users"("id") ON DELETE CASCADE;
      ALTER TABLE "recommendation_scores" ADD CONSTRAINT "FK_reco_job" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE;
      ALTER TABLE "recommendation_scores" ADD CONSTRAINT "FK_reco_applicant" FOREIGN KEY ("applicant_id") REFERENCES "users"("id") ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`

      -- DROP CONSTRAINTS
      ALTER TABLE "recommendation_scores" DROP CONSTRAINT "FK_reco_applicant";
      ALTER TABLE "recommendation_scores" DROP CONSTRAINT "FK_reco_job";
      ALTER TABLE "jobs" DROP CONSTRAINT "FK_job_posted_by";
      ALTER TABLE "nonprofit_orgs" DROP CONSTRAINT "FK_nonprofit_user";
      ALTER TABLE "applicant_profiles" DROP CONSTRAINT "FK_applicant_user";

      -- DROP INDEXES
      DROP INDEX "IDX_recommendation_scores_job_applicant";

      -- DROP TABLES
      DROP TABLE "recommendation_scores";
      DROP TABLE "jobs";
      DROP TABLE "nonprofit_orgs";
      DROP TABLE "applicant_profiles";
      DROP TABLE "users";

      -- DROP ENUMS
      DROP TYPE "public"."otp_channel";
      DROP TYPE "public"."channel_type";
      DROP TYPE "public"."policy_type";
      DROP TYPE "public"."page_type";
      DROP TYPE "public"."audit_action";
      DROP TYPE "public"."sms_status";
      DROP TYPE "public"."sms_provider";
      DROP TYPE "public"."email_log_status";
      DROP TYPE "public"."provider_type";
      DROP TYPE "public"."notification_type";
      DROP TYPE "public"."message_type";
      DROP TYPE "public"."application_status";
      DROP TYPE "public"."job_status";
      DROP TYPE "public"."job_placement";
      DROP TYPE "public"."employment_type";
      DROP TYPE "public"."gender";
      DROP TYPE "public"."user_role";

    `);
  }
}
