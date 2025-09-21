import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class StorageProviders1725057600003 implements MigrationInterface {
  name = 'StorageProviders1725057600003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create storage_providers table
    await queryRunner.createTable(
      new Table({
        name: 'storage_providers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['cloudinary', 'aws_s3', 'google_cloud_storage', 'azure_blob', 'local'],
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: false,
          },
          {
            name: 'priority',
            type: 'integer',
            default: 1,
          },
          {
            name: 'configuration',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'usageCount',
            type: 'integer',
            default: 0,
          },
          {
            name: 'totalStorageUsed',
            type: 'bigint',
            default: 0,
          },
          {
            name: 'isHealthy',
            type: 'boolean',
            default: true,
          },
          {
            name: 'lastHealthCheck',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'healthCheckError',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create file_uploads table
    await queryRunner.createTable(
      new Table({
        name: 'file_uploads',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'filename',
            type: 'varchar',
          },
          {
            name: 'originalFilename',
            type: 'varchar',
          },
          {
            name: 'mimeType',
            type: 'varchar',
          },
          {
            name: 'size',
            type: 'bigint',
          },
          {
            name: 'url',
            type: 'varchar',
          },
          {
            name: 'thumbnailUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'fileType',
            type: 'enum',
            enum: [
              'profile_picture',
              'company_logo',
              'ngo_logo',
              'resume',
              'cover_letter',
              'certificate',
              'document',
              'image',
              'video',
              'audio',
              'other',
            ],
          },
          {
            name: 'folder',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'publicId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'isPublic',
            type: 'boolean',
            default: false,
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'storageProviderId',
            type: 'uuid',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['storageProviderId'],
            referencedTableName: 'storage_providers',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Create indexes for performance
    await queryRunner.createIndex(
      'storage_providers',
      new Index('IDX_storage_providers_active_priority', ['isActive', 'priority']),
    );

    await queryRunner.createIndex(
      'storage_providers',
      new Index('IDX_storage_providers_type', ['type']),
    );

    await queryRunner.createIndex(
      'file_uploads',
      new Index('IDX_file_uploads_user_created', ['userId', 'createdAt']),
    );

    await queryRunner.createIndex(
      'file_uploads',
      new Index('IDX_file_uploads_provider_created', ['storageProviderId', 'createdAt']),
    );

    await queryRunner.createIndex(
      'file_uploads',
      new Index('IDX_file_uploads_file_type', ['fileType']),
    );

    await queryRunner.createIndex(
      'file_uploads',
      new Index('IDX_file_uploads_deleted_at', ['deletedAt']),
    );

    // Insert default Cloudinary provider if environment variables are available
    await queryRunner.query(`
      INSERT INTO storage_providers (
        name, 
        type, 
        isActive, 
        priority, 
        configuration, 
        description,
        metadata
      ) VALUES (
        'Default Cloudinary',
        'cloudinary',
        true,
        1,
        '{
          "cloudName": "${process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name'}",
          "apiKey": "${process.env.CLOUDINARY_API_KEY || 'your-api-key'}",
          "apiSecret": "${process.env.CLOUDINARY_API_SECRET || 'your-api-secret'}",
          "defaultFolder": "pairova"
        }',
        'Default Cloudinary storage provider configured from environment variables',
        '{
          "createdBy": "migration",
          "createdAt": "${new Date().toISOString()}",
          "isDefault": true
        }'
      ) ON CONFLICT (name) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('file_uploads', 'IDX_file_uploads_deleted_at');
    await queryRunner.dropIndex('file_uploads', 'IDX_file_uploads_file_type');
    await queryRunner.dropIndex('file_uploads', 'IDX_file_uploads_provider_created');
    await queryRunner.dropIndex('file_uploads', 'IDX_file_uploads_user_created');
    await queryRunner.dropIndex('storage_providers', 'IDX_storage_providers_type');
    await queryRunner.dropIndex('storage_providers', 'IDX_storage_providers_active_priority');

    // Drop tables
    await queryRunner.dropTable('file_uploads');
    await queryRunner.dropTable('storage_providers');
  }
}
