import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * Ensures the applicant_profiles table has the postal_code column required by
 * the ApplicantProfile entity (used during onboarding/profile updates).
 */
export class AddPostalCodeToApplicantProfiles1762001000000 implements MigrationInterface {
  private readonly tableName = 'applicant_profiles';
  private readonly columnName = 'postal_code';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn(this.tableName, this.columnName);
    if (hasColumn) {
      return;
    }

    await queryRunner.addColumn(
      this.tableName,
      new TableColumn({
        name: this.columnName,
        type: 'varchar',
        length: '20',
        isNullable: true,
        comment: 'Postal or ZIP code.',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn(this.tableName, this.columnName);
    if (!hasColumn) {
      return;
    }

    await queryRunner.dropColumn(this.tableName, this.columnName);
  }
}







