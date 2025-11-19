import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCertificateToNonprofit1761760000000 implements MigrationInterface {
  name = 'AddCertificateToNonprofit1761760000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add certificate_url column to nonprofit_orgs table
    await queryRunner.addColumn(
      'nonprofit_orgs',
      new TableColumn({
        name: 'certificate_url',
        type: 'text',
        isNullable: true,
        comment: 'URL to organization certificate of registration/operation',
      }),
    );

    console.log('✅ Added certificate_url column to nonprofit_orgs table');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove certificate_url column
    await queryRunner.dropColumn('nonprofit_orgs', 'certificate_url');

    console.log('✅ Removed certificate_url column from nonprofit_orgs table');
  }
}

















