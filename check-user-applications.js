/**
 * Script to check database for user and their job applications
 * Usage: node check-user-applications.js <email>
 * Example: node check-user-applications.js lawalopeg001@gmail.com
 */

require('dotenv').config();
const { Client } = require('pg');

const email = process.argv[2] || 'lawalopeg001@gmail.com';

const getDbConfig = () => {
  if (process.env.DATABASE_URL) {
    return { connectionString: process.env.DATABASE_URL };
  }
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'pairova',
  };
};

async function checkUserApplications() {
  const client = new Client(getDbConfig());
  
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Find user by email
    console.log(`🔍 Looking for user: ${email}\n`);
    const userResult = await client.query(
      'SELECT id, email, role, is_verified, has_completed_onboarding, created_at FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      console.log(`❌ User not found: ${email}`);
      await client.end();
      return;
    }

    const user = userResult.rows[0];
    console.log(`✅ User found:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Verified: ${user.is_verified ? 'Yes' : 'No'}`);
    console.log(`   Onboarding Completed: ${user.has_completed_onboarding ? 'Yes' : 'No'}`);
    console.log(`   Created At: ${user.created_at}\n`);

    // Get applicant profile if exists
    if (user.role === 'APPLICANT') {
      const profileResult = await client.query(
        'SELECT first_name, last_name, work_position, country, city, state FROM applicant_profiles WHERE user_id = $1',
        [user.id]
      );
      
      if (profileResult.rows.length > 0) {
        const profile = profileResult.rows[0];
        console.log('📌 APPLICANT PROFILE:');
        console.log(`   Name: ${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'N/A');
        console.log(`   Position: ${profile.work_position || 'N/A'}`);
        console.log(`   Location: ${[profile.city, profile.state, profile.country].filter(Boolean).join(', ') || 'N/A'}\n`);
      }
    }

    // Get job applications
    console.log('📋 JOB APPLICATIONS:');
    const applicationsResult = await client.query(
      `SELECT 
        a.id,
        a.status,
        a.applied_at,
        a.match_score,
        j.id as job_id,
        j.title as job_title,
        j.employment_type,
        j.placement,
        j.location_city,
        j.location_state,
        j.location_country,
        n.org_name as nonprofit_name
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      LEFT JOIN nonprofit_orgs n ON j.org_user_id = n.user_id
      WHERE a.applicant_id = $1
      ORDER BY a.applied_at DESC`,
      [user.id]
    );

    if (applicationsResult.rows.length === 0) {
      console.log('   ❌ No job applications found\n');
    } else {
      console.log(`   Total Applications: ${applicationsResult.rows.length}\n`);
      
      applicationsResult.rows.forEach((app, index) => {
        console.log(`   Application ${index + 1}:`);
        console.log(`      Application ID: ${app.id}`);
        console.log(`      Status: ${app.status}`);
        console.log(`      Applied At: ${app.applied_at}`);
        console.log(`      Match Score: ${app.match_score || 'N/A'}`);
        console.log(`      Job ID: ${app.job_id}`);
        console.log(`      Job Title: ${app.job_title || 'N/A'}`);
        console.log(`      Employment Type: ${app.employment_type || 'N/A'}`);
        console.log(`      Placement: ${app.placement || 'N/A'}`);
        console.log(`      Location: ${[app.location_city, app.location_state, app.location_country].filter(Boolean).join(', ') || 'N/A'}`);
        console.log(`      Organization: ${app.nonprofit_name || 'N/A'}`);
        console.log('');
      });
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Total Applications: ${applicationsResult.rows.length}`);
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  } finally {
    await client.end();
    console.log('✅ Database connection closed');
  }
}

checkUserApplications().catch(console.error);
