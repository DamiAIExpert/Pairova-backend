import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOnboardingCompletionToUsers1730000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'has_completed_onboarding',
        type: 'boolean',
        default: false,
        comment: 'Flag indicating whether the user has completed the onboarding/profile setup process',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'has_completed_onboarding');
  }
}


