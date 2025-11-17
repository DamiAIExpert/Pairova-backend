import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Creates supporting applicant tables (educations, experiences, certifications, uploads)
 * that are referenced by the NestJS profile modules.
 */
export class CreateApplicantArtifacts1762003000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "educations" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "applicantId" uuid NOT NULL,
        "school" character varying(255) NOT NULL,
        "degree" character varying(255),
        "field_of_study" character varying(255),
        "grade" character varying(255),
        "role" character varying(255),
        "description" text,
        "startDate" date,
        "endDate" date,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "user_id" uuid,
        CONSTRAINT "PK_educations" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_educations_user" ON "educations" ("userId")
    `);

    await queryRunner.query(`
      ALTER TABLE "educations"
      ADD CONSTRAINT "FK_educations_user_relation"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      CREATE TABLE "experiences" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "applicantId" uuid NOT NULL,
        "company" character varying(255) NOT NULL,
        "roleTitle" character varying(255) NOT NULL,
        "employmentType" "public"."employment_type",
        "locationCity" character varying(100),
        "locationState" character varying(100),
        "locationCountry" character varying(100),
        "postal_code" character varying(20),
        "startDate" date,
        "endDate" date,
        "description" text,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "user_id" uuid,
        CONSTRAINT "PK_experiences" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_experiences_user" ON "experiences" ("userId")
    `);

    await queryRunner.query(`
      ALTER TABLE "experiences"
      ADD CONSTRAINT "FK_experiences_user_relation"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      CREATE TABLE "certifications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "applicantId" uuid NOT NULL,
        "name" character varying(255) NOT NULL,
        "issuer" character varying(255),
        "issueDate" date,
        "issuedDate" date,
        "credentialUrl" text,
        "credentialId" character varying(255),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "user_id" uuid,
        CONSTRAINT "PK_certifications" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_certifications_user" ON "certifications" ("userId")
    `);

    await queryRunner.query(`
      ALTER TABLE "certifications"
      ADD CONSTRAINT "FK_certifications_user_relation"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      CREATE TABLE "uploads" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid,
        "kind" character varying(64) NOT NULL,
        "fileUrl" text NOT NULL,
        "publicId" character varying(255),
        "mimeType" character varying(128),
        "sizeBytes" bigint,
        "filename" character varying(255),
        "url" text,
        "size" bigint,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_uploads" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_uploads_user_kind" ON "uploads" ("user_id", "kind")
    `);

    await queryRunner.query(`
      ALTER TABLE "uploads"
      ADD CONSTRAINT "FK_uploads_user_relation"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" DROP CONSTRAINT "FK_uploads_user_relation"`);
    await queryRunner.query(`DROP INDEX "IDX_uploads_user_kind"`);
    await queryRunner.query(`DROP TABLE "uploads"`);

    await queryRunner.query(`ALTER TABLE "certifications" DROP CONSTRAINT "FK_certifications_user_relation"`);
    await queryRunner.query(`DROP INDEX "IDX_certifications_user"`);
    await queryRunner.query(`DROP TABLE "certifications"`);

    await queryRunner.query(`ALTER TABLE "experiences" DROP CONSTRAINT "FK_experiences_user_relation"`);
    await queryRunner.query(`DROP INDEX "IDX_experiences_user"`);
    await queryRunner.query(`DROP TABLE "experiences"`);

    await queryRunner.query(`ALTER TABLE "educations" DROP CONSTRAINT "FK_educations_user_relation"`);
    await queryRunner.query(`DROP INDEX "IDX_educations_user"`);
    await queryRunner.query(`DROP TABLE "educations"`);
  }
}







