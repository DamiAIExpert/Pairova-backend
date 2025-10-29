import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddComprehensiveApplicationData1761434000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add JSON column to store comprehensive application data
    await queryRunner.addColumn(
      'applications',
      new TableColumn({
        name: 'application_data',
        type: 'jsonb',
        isNullable: true,
        comment: 'Comprehensive application data including personal details, experience, education, certifications, and skills',
      }),
    );

    // Add indexes for commonly queried fields in the JSON
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_applications_data_email" 
      ON "applications" ((application_data->>'email'));
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_applications_data_fullname" 
      ON "applications" ((application_data->>'fullName'));
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_applications_data_email";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_applications_data_fullname";`);

    // Drop column
    await queryRunner.dropColumn('applications', 'application_data');
  }
}


