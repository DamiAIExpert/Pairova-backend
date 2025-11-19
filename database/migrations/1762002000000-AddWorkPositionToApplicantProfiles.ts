import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * Adds the work_position column expected by ApplicantProfile entity.
 */
export class AddWorkPositionToApplicantProfiles1762002000000 implements MigrationInterface {
  private readonly tableName = 'applicant_profiles';
  private readonly columnName = 'work_position';

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
        length: '100',
        isNullable: true,
        comment: 'Current work position or job title.',
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












