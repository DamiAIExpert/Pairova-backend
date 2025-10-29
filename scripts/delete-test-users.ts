import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [path.join(__dirname, '..', 'src', '**', '*.entity.{ts,js}')],
  synchronize: false,
});

async function deleteTestUsers() {
  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    // Find all users with email containing test variations
    const users = await dataSource.query(
      `SELECT id, email, role, created_at FROM users 
       WHERE email ILIKE '%damitobex%' 
       OR email ILIKE '%dmaitobex%' 
       OR email ILIKE '%damin%'
       OR email ILIKE '%damilola%'
       OR email ILIKE '%ogunniyi%'`
    );

    console.log(`\n📋 Found ${users.length} user(s):`);
    users.forEach((user: any, index: number) => {
      console.log(`  ${index + 1}. ${user.email} (${user.role}) - ID: ${user.id}`);
    });

    if (users.length === 0) {
      console.log('\n✅ No users found to delete.');
      await dataSource.destroy();
      return;
    }

    console.log('\n🗑️  Deleting users and related data...');

    for (const user of users) {
      // Delete related data (cascading should handle most, but let's be explicit)
      
      // Delete OTPs
      await dataSource.query(`DELETE FROM otps WHERE user_id = $1`, [user.id]);
      
      // Delete applicant profile (if exists)
      await dataSource.query(`DELETE FROM applicant_profiles WHERE user_id = $1`, [user.id]);
      
      // Delete nonprofit org (if exists)
      await dataSource.query(`DELETE FROM nonprofit_orgs WHERE user_id = $1`, [user.id]);
      
      // Delete saved jobs
      await dataSource.query(`DELETE FROM saved_jobs WHERE user_id = $1`, [user.id]);
      
      // Delete notifications
      await dataSource.query(`DELETE FROM notifications WHERE user_id = $1`, [user.id]);
      
      // Delete notification preferences
      await dataSource.query(`DELETE FROM notification_preferences WHERE user_id = $1`, [user.id]);
      
      // Delete the user
      await dataSource.query(`DELETE FROM users WHERE id = $1`, [user.id]);
      
      console.log(`  ✅ Deleted: ${user.email}`);
    }

    console.log(`\n🎉 Successfully deleted ${users.length} user(s) and all related data!`);

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

deleteTestUsers();

