import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOtpTable1761010000000 implements MigrationInterface {
  name = 'CreateOtpTable1761010000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create OTP table
    await queryRunner.query(`
      CREATE TABLE "otps" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "channel" "public"."otp_channel" NOT NULL,
        "code_hash" character varying(255) NOT NULL,
        "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "consumed_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_otps" PRIMARY KEY ("id")
      )
    `);

    // Create index for faster lookups
    await queryRunner.query(`
      CREATE INDEX "IDX_otps_user_channel" ON "otps" ("user_id", "channel")
    `);

    // Add foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "otps"
      ADD CONSTRAINT "FK_otps_user_id"
      FOREIGN KEY ("user_id")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    // Add comment
    await queryRunner.query(`
      COMMENT ON TABLE "otps" IS 'Stores one-time passwords for email and SMS verification'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key
    await queryRunner.query(`
      ALTER TABLE "otps" DROP CONSTRAINT "FK_otps_user_id"
    `);

    // Drop index
    await queryRunner.query(`
      DROP INDEX "IDX_otps_user_channel"
    `);

    // Drop table
    await queryRunner.query(`
      DROP TABLE "otps"
    `);
  }
}



