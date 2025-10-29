import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * Migration to add missing onboarding fields to nonprofit_orgs table
 * - mission_statement (alias for mission)
 * - phone
 * - postal_code
 */
export class AddOnboardingFieldsToNonprofit1730140000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add mission_statement column (alias for mission)
    await queryRunner.addColumn(
      'nonprofit_orgs',
      new TableColumn({
        name: 'mission_statement',
        type: 'text',
        isNullable: true,
        comment: 'The mission statement of the organization (alias for mission field)',
      }),
    );

    // Add phone column
    await queryRunner.addColumn(
      'nonprofit_orgs',
      new TableColumn({
        name: 'phone',
        type: 'varchar',
        length: '20',
        isNullable: true,
        comment: 'Organization contact phone number',
      }),
    );

    // Add postal_code column
    await queryRunner.addColumn(
      'nonprofit_orgs',
      new TableColumn({
        name: 'postal_code',
        type: 'varchar',
        length: '20',
        isNullable: true,
        comment: 'Postal/ZIP code for the organization address',
      }),
    );

    console.log('✅ Added mission_statement, phone, and postal_code columns to nonprofit_orgs table');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove columns in reverse order
    await queryRunner.dropColumn('nonprofit_orgs', 'postal_code');
    await queryRunner.dropColumn('nonprofit_orgs', 'phone');
    await queryRunner.dropColumn('nonprofit_orgs', 'mission_statement');

    console.log('✅ Removed mission_statement, phone, and postal_code columns from nonprofit_orgs table');
  }
}

