// Script to fix Cloudinary storage provider configuration
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

async function fixCloudinaryProvider() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    // Or use individual connection params if DATABASE_URL is not set
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  try {
    console.log('🔌 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Connected to database');

    // Delete existing Cloudinary providers
    console.log('🗑️  Removing old Cloudinary providers...');
    await dataSource.query(`DELETE FROM storage_providers WHERE type = 'cloudinary'`);

    // Insert new Cloudinary provider with correct credentials
    console.log('📦 Creating new Cloudinary provider...');
    const result = await dataSource.query(`
      INSERT INTO storage_providers (
        name,
        type,
        "isActive",
        priority,
        configuration,
        description,
        "isHealthy",
        metadata
      ) VALUES (
        'Default Cloudinary',
        'cloudinary',
        true,
        1,
        $1::jsonb,
        'Default Cloudinary storage provider for Pairova',
        true,
        $2::jsonb
      )
      RETURNING id, name, type, "isActive", "isHealthy"
    `, [
      JSON.stringify({
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        defaultFolder: 'pairova',
      }),
      JSON.stringify({
        createdBy: 'fix-script',
        createdAt: new Date().toISOString(),
        isDefault: true,
      }),
    ]);

    console.log('✅ Cloudinary provider created successfully:');
    console.log(result[0]);

    // Verify
    const providers = await dataSource.query(`
      SELECT id, name, type, "isActive", "isHealthy", configuration
      FROM storage_providers
      WHERE type = 'cloudinary'
    `);

    console.log('\n📋 Current Cloudinary providers:');
    console.log(JSON.stringify(providers, null, 2));

    await dataSource.destroy();
    console.log('\n🎉 Done! File upload should now work.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixCloudinaryProvider();












