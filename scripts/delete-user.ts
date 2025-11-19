import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../src/users/shared/user.entity';
import { ApplicantProfile } from '../src/users/applicant/applicant.entity';
import { NonprofitOrg } from '../src/users/nonprofit/nonprofit.entity';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, ApplicantProfile, NonprofitOrg],
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function deleteUser() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected\n');

    const userRepository = AppDataSource.getRepository(User);
    const email = 'damitobex@gmail.com';

    // First, check if user exists
    const user = await userRepository.findOne({
      where: { email },
      relations: ['applicantProfile', 'nonprofitOrg'],
    });

    if (!user) {
      console.log(`❌ User with email "${email}" not found`);
      return;
    }

    console.log('📋 Found user:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    
    if (user.applicantProfile) {
      console.log(`   Has Applicant Profile: Yes`);
    }
    if (user.nonprofitOrg) {
      console.log(`   Has Nonprofit Org: Yes`);
    }

    console.log('\n🗑️  Deleting user and related data...');

    // Delete the user (cascade should handle related profiles)
    await userRepository.remove(user);

    console.log('✅ User deleted successfully!');
    console.log(`   Email: ${email}`);
    console.log(`   ID: ${user.id}`);
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
}

deleteUser();









