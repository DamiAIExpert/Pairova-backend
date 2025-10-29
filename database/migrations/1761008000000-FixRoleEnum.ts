import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixRoleEnum1761008000000 implements MigrationInterface {
  name = 'FixRoleEnum1761008000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Fix the user role enum to match TypeScript enum values
    await queryRunner.query(`
      -- Create new enum with lowercase values
      CREATE TYPE "public"."user_role_new" AS ENUM('admin', 'applicant', 'nonprofit');
    `);
    
    await queryRunner.query(`
      -- Add temporary column with new enum type
      ALTER TABLE "users" ADD COLUMN "role_temp" "public"."user_role_new";
    `);
    
    await queryRunner.query(`
      -- Copy data from old column to new column, converting to lowercase
      UPDATE "users" SET "role_temp" = LOWER("role"::text)::"public"."user_role_new";
    `);
    
    await queryRunner.query(`
      -- Drop old column and rename new one
      ALTER TABLE "users" DROP COLUMN "role";
      ALTER TABLE "users" RENAME COLUMN "role_temp" TO "role";
    `);
    
    await queryRunner.query(`
      -- Drop old enum and rename new one
      DROP TYPE "public"."user_role";
      ALTER TYPE "public"."user_role_new" RENAME TO "user_role";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert back to uppercase enum
    await queryRunner.query(`
      -- Create old enum with uppercase values
      CREATE TYPE "public"."user_role_old" AS ENUM('ADMIN', 'APPLICANT', 'NONPROFIT');
    `);
    
    await queryRunner.query(`
      -- Add temporary column with old enum type
      ALTER TABLE "users" ADD COLUMN "role_temp" "public"."user_role_old";
    `);
    
    await queryRunner.query(`
      -- Copy data from new column to old column, converting to uppercase
      UPDATE "users" SET "role_temp" = UPPER("role"::text)::"public"."user_role_old";
    `);
    
    await queryRunner.query(`
      -- Drop new column and rename old one
      ALTER TABLE "users" DROP COLUMN "role";
      ALTER TABLE "users" RENAME COLUMN "role_temp" TO "role";
    `);
    
    await queryRunner.query(`
      -- Drop new enum and rename old one
      DROP TYPE "public"."user_role";
      ALTER TYPE "public"."user_role_old" RENAME TO "user_role";
    `);
  }
}
