import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * @class SmsProviders1725057600001
 * @description Migration to add SMS provider and logging tables
 */
export class SmsProviders1725057600001 implements MigrationInterface {
  name = 'SmsProviders1725057600001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      -- SMS Provider Types
      CREATE TYPE "public"."sms_provider_type" AS ENUM(
        'TWILIO', 
        'CLICKATELL', 
        'MSG91', 
        'NEXMO', 
        'AFRICASTALKING', 
        'CM_COM', 
        'TELESIGN'
      );

      -- SMS Provider Status
      CREATE TYPE "public"."sms_provider_status" AS ENUM(
        'ACTIVE', 
        'INACTIVE', 
        'MAINTENANCE', 
        'ERROR'
      );

      -- SMS Status
      CREATE TYPE "public"."sms_status" AS ENUM(
        'PENDING', 
        'SENT', 
        'DELIVERED', 
        'FAILED', 
        'EXPIRED', 
        'UNKNOWN'
      );

      -- SMS Type
      CREATE TYPE "public"."sms_type" AS ENUM(
        'VERIFICATION', 
        'NOTIFICATION', 
        'MARKETING', 
        'ALERT', 
        'REMINDER', 
        'SYSTEM'
      );

      -- SMS Providers Table
      CREATE TABLE "sms_providers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "providerType" "public"."sms_provider_type" NOT NULL,
        "status" "public"."sms_provider_status" NOT NULL DEFAULT 'INACTIVE',
        "name" character varying(255) NOT NULL,
        "description" text,
        "configuration" jsonb NOT NULL,
        "isActive" boolean NOT NULL DEFAULT false,
        "priority" integer NOT NULL DEFAULT 1,
        "isEnabled" boolean NOT NULL DEFAULT true,
        "costPerSms" numeric(10,4),
        "currency" character varying(10) NOT NULL DEFAULT 'USD',
        "supportedCountries" character varying(255)[] NOT NULL DEFAULT '{}',
        "supportedFeatures" character varying(255)[] NOT NULL DEFAULT '{}',
        "lastHealthCheck" TIMESTAMP WITH TIME ZONE,
        "isHealthy" boolean NOT NULL DEFAULT true,
        "totalSent" integer NOT NULL DEFAULT 0,
        "totalDelivered" integer NOT NULL DEFAULT 0,
        "deliveryRate" numeric(5,2) NOT NULL DEFAULT 0,
        "totalErrors" integer NOT NULL DEFAULT 0,
        "lastError" character varying(500),
        "lastUsed" TIMESTAMP WITH TIME ZONE,
        "metadata" jsonb,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_sms_providers" PRIMARY KEY ("id")
      );

      -- SMS Logs Table
      CREATE TABLE "sms_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "providerId" uuid NOT NULL,
        "recipient" character varying(20) NOT NULL,
        "message" text NOT NULL,
        "type" "public"."sms_type" NOT NULL DEFAULT 'NOTIFICATION',
        "status" "public"."sms_status" NOT NULL DEFAULT 'PENDING',
        "providerMessageId" character varying(255),
        "providerReference" character varying(255),
        "cost" numeric(10,4),
        "currency" character varying(10) NOT NULL DEFAULT 'USD',
        "errorMessage" character varying(500),
        "errorCode" character varying(50),
        "providerResponse" jsonb,
        "sentAt" TIMESTAMP WITH TIME ZONE,
        "deliveredAt" TIMESTAMP WITH TIME ZONE,
        "failedAt" TIMESTAMP WITH TIME ZONE,
        "userId" uuid,
        "campaignId" character varying(255),
        "metadata" jsonb,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_sms_logs" PRIMARY KEY ("id")
      );

      -- Indexes for SMS Providers
      CREATE INDEX "IDX_sms_providers_active_priority" ON "sms_providers" ("isActive", "priority");
      CREATE INDEX "IDX_sms_providers_type" ON "sms_providers" ("providerType");

      -- Indexes for SMS Logs
      CREATE INDEX "IDX_sms_logs_recipient" ON "sms_logs" ("recipient");
      CREATE INDEX "IDX_sms_logs_status" ON "sms_logs" ("status");
      CREATE INDEX "IDX_sms_logs_provider" ON "sms_logs" ("providerId");
      CREATE INDEX "IDX_sms_logs_created" ON "sms_logs" ("createdAt");

      -- Foreign Key Constraints
      ALTER TABLE "sms_logs" 
      ADD CONSTRAINT "FK_sms_logs_provider" 
      FOREIGN KEY ("providerId") REFERENCES "sms_providers"("id") ON DELETE CASCADE;

      -- Comments
      COMMENT ON TABLE "sms_providers" IS 'SMS provider configurations with failover support';
      COMMENT ON TABLE "sms_logs" IS 'SMS message logs and delivery tracking';
      COMMENT ON COLUMN "sms_providers"."priority" IS 'Lower number = higher priority for failover';
      COMMENT ON COLUMN "sms_providers"."configuration" IS 'Provider-specific configuration stored as JSON';
      COMMENT ON COLUMN "sms_logs"."providerMessageId" IS 'Message ID returned by SMS provider';
      COMMENT ON COLUMN "sms_logs"."providerResponse" IS 'Full response from SMS provider API';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      -- Drop foreign key constraints
      ALTER TABLE "sms_logs" DROP CONSTRAINT "FK_sms_logs_provider";

      -- Drop indexes
      DROP INDEX "IDX_sms_logs_created";
      DROP INDEX "IDX_sms_logs_provider";
      DROP INDEX "IDX_sms_logs_status";
      DROP INDEX "IDX_sms_logs_recipient";
      DROP INDEX "IDX_sms_providers_type";
      DROP INDEX "IDX_sms_providers_active_priority";

      -- Drop tables
      DROP TABLE "sms_logs";
      DROP TABLE "sms_providers";

      -- Drop enums
      DROP TYPE "public"."sms_type";
      DROP TYPE "public"."sms_status";
      DROP TYPE "public"."sms_provider_status";
      DROP TYPE "public"."sms_provider_type";
    `);
  }
}
