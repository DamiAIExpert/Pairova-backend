import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * @class EnhancedMessaging1725057600002
 * @description Migration to enhance messaging system with advanced features
 */
export class EnhancedMessaging1725057600002 implements MigrationInterface {
  name = 'EnhancedMessaging1725057600002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      -- Enhanced messaging enums
      CREATE TYPE "public"."conversation_type" AS ENUM(
        'DIRECT', 
        'JOB_RELATED', 
        'INTERVIEW', 
        'SUPPORT'
      );

      CREATE TYPE "public"."conversation_status" AS ENUM(
        'ACTIVE', 
        'ARCHIVED', 
        'BLOCKED', 
        'DELETED'
      );

      CREATE TYPE "public"."message_status_type" AS ENUM(
        'SENT', 
        'DELIVERED', 
        'READ', 
        'FAILED'
      );

      -- Update conversations table
      ALTER TABLE "conversations" 
      ADD COLUMN IF NOT EXISTS "type" "public"."conversation_type" NOT NULL DEFAULT 'DIRECT',
      ADD COLUMN IF NOT EXISTS "status" "public"."conversation_status" NOT NULL DEFAULT 'ACTIVE',
      ADD COLUMN IF NOT EXISTS "title" character varying(255),
      ADD COLUMN IF NOT EXISTS "description" text,
      ADD COLUMN IF NOT EXISTS "job_id" uuid,
      ADD COLUMN IF NOT EXISTS "created_by_id" uuid,
      ADD COLUMN IF NOT EXISTS "is_archived" boolean NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "last_message_at" TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS "metadata" jsonb;

      -- Add foreign key constraints for conversations
      ALTER TABLE "conversations" 
      ADD CONSTRAINT "FK_conversation_job" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE SET NULL,
      ADD CONSTRAINT "FK_conversation_created_by" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL;

      -- Update conversation_participants table
      ALTER TABLE "conversation_participants"
      ADD COLUMN IF NOT EXISTS "joined_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      ADD COLUMN IF NOT EXISTS "last_seen_at" TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS "role" character varying(50) NOT NULL DEFAULT 'PARTICIPANT';

      -- Update messages table
      ALTER TABLE "messages"
      ADD COLUMN IF NOT EXISTS "reply_to_id" uuid,
      ADD COLUMN IF NOT EXISTS "metadata" jsonb;

      -- Add foreign key constraint for reply-to messages
      ALTER TABLE "messages" 
      ADD CONSTRAINT "FK_message_reply_to" FOREIGN KEY ("reply_to_id") REFERENCES "messages"("id") ON DELETE SET NULL;

      -- Create message_status table
      CREATE TABLE "message_status" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "message_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "status" "public"."message_status_type" NOT NULL DEFAULT 'SENT',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_message_status" PRIMARY KEY ("id")
      );

      -- Add foreign key constraints for message_status
      ALTER TABLE "message_status" 
      ADD CONSTRAINT "FK_message_status_message" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE,
      ADD CONSTRAINT "FK_message_status_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;

      -- Create indexes for performance
      CREATE INDEX "IDX_conversations_type_status" ON "conversations" ("type", "status");
      CREATE INDEX "IDX_conversations_last_message" ON "conversations" ("last_message_at");
      CREATE INDEX "IDX_conversations_job" ON "conversations" ("job_id");
      CREATE INDEX "IDX_conversations_created_by" ON "conversations" ("created_by_id");

      CREATE INDEX "IDX_message_status_message_user" ON "message_status" ("message_id", "user_id");
      CREATE INDEX "IDX_message_status_user_status" ON "message_status" ("user_id", "status");
      CREATE INDEX "IDX_message_status_message" ON "message_status" ("message_id");

      CREATE INDEX "IDX_conversation_participants_joined" ON "conversation_participants" ("joined_at");
      CREATE INDEX "IDX_conversation_participants_last_seen" ON "conversation_participants" ("last_seen_at");

      CREATE INDEX "IDX_messages_reply_to" ON "messages" ("reply_to_id");
      CREATE INDEX "IDX_messages_conversation_sent" ON "messages" ("conversation_id", "sent_at");

      -- Add unique constraint for message status
      CREATE UNIQUE INDEX "IDX_message_status_unique" ON "message_status" ("message_id", "user_id");

      -- Comments
      COMMENT ON COLUMN "conversations"."type" IS 'Type of conversation (direct, job-related, interview, support)';
      COMMENT ON COLUMN "conversations"."status" IS 'Status of the conversation';
      COMMENT ON COLUMN "conversations"."job_id" IS 'Related job ID for job-related conversations';
      COMMENT ON COLUMN "conversations"."created_by_id" IS 'User who created the conversation';
      COMMENT ON COLUMN "conversations"."last_message_at" IS 'Timestamp of the last message in the conversation';
      COMMENT ON COLUMN "conversations"."metadata" IS 'Additional conversation metadata (tags, priority, etc.)';

      COMMENT ON COLUMN "conversation_participants"."joined_at" IS 'When the user joined the conversation';
      COMMENT ON COLUMN "conversation_participants"."last_seen_at" IS 'When the user was last seen in the conversation';
      COMMENT ON COLUMN "conversation_participants"."role" IS 'Role of the participant (creator, participant, etc.)';

      COMMENT ON COLUMN "messages"."reply_to_id" IS 'ID of the message this is replying to';
      COMMENT ON COLUMN "messages"."metadata" IS 'Additional message metadata (urgent, expires, etc.)';

      COMMENT ON TABLE "message_status" IS 'Tracks message delivery and read status for each participant';
      COMMENT ON COLUMN "message_status"."status" IS 'Status of the message for this user';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      -- Drop indexes
      DROP INDEX IF EXISTS "IDX_messages_conversation_sent";
      DROP INDEX IF EXISTS "IDX_messages_reply_to";
      DROP INDEX IF EXISTS "IDX_conversation_participants_last_seen";
      DROP INDEX IF EXISTS "IDX_conversation_participants_joined";
      DROP INDEX IF EXISTS "IDX_message_status_message";
      DROP INDEX IF EXISTS "IDX_message_status_user_status";
      DROP INDEX IF EXISTS "IDX_message_status_message_user";
      DROP INDEX IF EXISTS "IDX_conversations_created_by";
      DROP INDEX IF EXISTS "IDX_conversations_job";
      DROP INDEX IF EXISTS "IDX_conversations_last_message";
      DROP INDEX IF EXISTS "IDX_conversations_type_status";

      -- Drop unique constraints
      DROP INDEX IF EXISTS "IDX_message_status_unique";

      -- Drop foreign key constraints
      ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_message_reply_to";
      ALTER TABLE "conversations" DROP CONSTRAINT IF EXISTS "FK_conversation_created_by";
      ALTER TABLE "conversations" DROP CONSTRAINT IF EXISTS "FK_conversation_job";

      -- Drop message_status table
      DROP TABLE IF EXISTS "message_status";

      -- Remove columns from messages table
      ALTER TABLE "messages" 
      DROP COLUMN IF EXISTS "metadata",
      DROP COLUMN IF EXISTS "reply_to_id";

      -- Remove columns from conversation_participants table
      ALTER TABLE "conversation_participants"
      DROP COLUMN IF EXISTS "role",
      DROP COLUMN IF EXISTS "last_seen_at",
      DROP COLUMN IF EXISTS "joined_at";

      -- Remove columns from conversations table
      ALTER TABLE "conversations" 
      DROP COLUMN IF EXISTS "metadata",
      DROP COLUMN IF EXISTS "last_message_at",
      DROP COLUMN IF EXISTS "is_archived",
      DROP COLUMN IF EXISTS "created_by_id",
      DROP COLUMN IF EXISTS "job_id",
      DROP COLUMN IF EXISTS "description",
      DROP COLUMN IF EXISTS "title",
      DROP COLUMN IF EXISTS "status",
      DROP COLUMN IF EXISTS "type";

      -- Drop enums
      DROP TYPE IF EXISTS "public"."message_status_type";
      DROP TYPE IF EXISTS "public"."conversation_status";
      DROP TYPE IF EXISTS "public"."conversation_type";
    `);
  }
}
