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

async function checkUser() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected\n');

    const userRepository = AppDataSource.getRepository(User);
    const email = 'damitobex@gmail.com';

    const user = await userRepository.findOne({
      where: { email },
      relations: ['applicantProfile', 'nonprofitOrg'],
    });

    if (!user) {
      console.log(`❌ User with email "${email}" not found`);
      return;
    }

    console.log('📋 USER INFORMATION:');
    console.log('═'.repeat(60));
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`Phone: ${user.phone || 'N/A'}`);
    console.log(`Is Verified: ${user.isVerified}`);
    console.log(`Has Completed Onboarding: ${user.hasCompletedOnboarding}`);
    console.log(`OAuth Provider: ${user.oauthProvider || 'N/A'}`);
    console.log(`OAuth ID: ${user.oauthId || 'N/A'}`);
    console.log(`Last Login: ${user.lastLoginAt || 'Never'}`);
    console.log(`Created At: ${user.createdAt}`);
    console.log(`Updated At: ${user.updatedAt}`);

    if (user.applicantProfile) {
      console.log('\n📋 APPLICANT PROFILE:');
      console.log('═'.repeat(60));
      console.log(`First Name: ${user.applicantProfile.firstName || 'N/A'}`);
      console.log(`Last Name: ${user.applicantProfile.lastName || 'N/A'}`);
      console.log(`Gender: ${user.applicantProfile.gender || 'N/A'}`);
      console.log(`Date of Birth: ${user.applicantProfile.dob || 'N/A'}`);
      console.log(`Bio: ${user.applicantProfile.bio || 'N/A'}`);
      console.log(`Country: ${user.applicantProfile.country || 'N/A'}`);
      console.log(`State: ${user.applicantProfile.state || 'N/A'}`);
      console.log(`City: ${user.applicantProfile.city || 'N/A'}`);
      console.log(`Photo URL: ${user.applicantProfile.photoUrl || 'N/A'}`);
      console.log(`Experience Level: ${user.applicantProfile.experienceLevel || 'N/A'}`);
    }

    if (user.nonprofitOrg) {
      console.log('\n📋 NONPROFIT ORGANIZATION:');
      console.log('═'.repeat(60));
      console.log(`Org Name: ${user.nonprofitOrg.orgName || 'N/A'}`);
      console.log(`First Name: ${user.nonprofitOrg.firstName || 'N/A'}`);
      console.log(`Last Name: ${user.nonprofitOrg.lastName || 'N/A'}`);
      console.log(`Logo URL: ${user.nonprofitOrg.logoUrl || 'N/A'}`);
      console.log(`Website: ${user.nonprofitOrg.website || 'N/A'}`);
    }

    if (user.oauthProfile) {
      console.log('\n📋 OAUTH PROFILE DATA:');
      console.log('═'.repeat(60));
      const oauthData = typeof user.oauthProfile === 'string' 
        ? JSON.parse(user.oauthProfile) 
        : user.oauthProfile;
      console.log(JSON.stringify(oauthData, null, 2));
    }

    console.log('\n✅ User check completed');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

checkUser();




