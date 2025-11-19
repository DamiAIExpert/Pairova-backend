const { Client } = require('pg');
require('dotenv').config();

const email = 'deogunniyi@pg-student.oauife.edu.ng';

const getDbConfig = () => {
  if (process.env.DATABASE_URL) {
    return { connectionString: process.env.DATABASE_URL };
  }
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'pairova',
  };
};

async function checkNgoApplicants() {
  const client = new Client(getDbConfig());
  
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Find NGO user by email
    console.log(`🔍 Looking for NGO user: ${email}\n`);
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
    console.log(`✅ NGO User found:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Verified: ${user.is_verified ? 'Yes' : 'No'}`);
    console.log(`   Onboarding Completed: ${user.has_completed_onboarding ? 'Yes' : 'No'}`);
    console.log(`   Created At: ${user.created_at}\n`);

    if (user.role !== 'NONPROFIT') {
      console.log(`⚠️  Warning: User role is "${user.role}", not "NONPROFIT"\n`);
    }

    // Get nonprofit organization details
    const orgResult = await client.query(
      'SELECT org_name, mission_statement, website, phone FROM nonprofit_orgs WHERE user_id = $1',
      [user.id]
    );

    if (orgResult.rows.length > 0) {
      const org = orgResult.rows[0];
      console.log('🏢 NONPROFIT ORGANIZATION:');
      console.log(`   Name: ${org.org_name || 'N/A'}`);
      console.log(`   Mission: ${org.mission_statement ? org.mission_statement.substring(0, 100) + '...' : 'N/A'}`);
      console.log(`   Website: ${org.website || 'N/A'}`);
      console.log(`   Phone: ${org.phone || 'N/A'}\n`);
    } else {
      console.log('⚠️  No nonprofit organization record found\n');
    }

    // Get jobs posted by this NGO
    console.log('📋 JOBS POSTED BY THIS NGO:');
    const jobsResult = await client.query(
      `SELECT 
        id,
        title,
        status,
        employment_type,
        location_city,
        location_state,
        location_country,
        created_at,
        published_at
      FROM jobs
      WHERE org_user_id = $1
      ORDER BY created_at DESC`,
      [user.id]
    );

    if (jobsResult.rows.length === 0) {
      console.log('   ❌ No jobs found\n');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('📊 SUMMARY');
      console.log('═══════════════════════════════════════════════════════════');
      console.log(`   User: ${user.email}`);
      console.log(`   Jobs Posted: 0`);
      console.log(`   Total Applications: 0`);
      console.log(`   Unique Applicants: 0`);
      await client.end();
      return;
    }

    console.log(`   Total Jobs: ${jobsResult.rows.length}\n`);
    const jobIds = jobsResult.rows.map(job => job.id);

    jobsResult.rows.forEach((job, index) => {
      console.log(`   Job ${index + 1}:`);
      console.log(`      Job ID: ${job.id}`);
      console.log(`      Title: ${job.title || 'N/A'}`);
      console.log(`      Status: ${job.status || 'N/A'}`);
      console.log(`      Employment Type: ${job.employment_type || 'N/A'}`);
      console.log(`      Location: ${[job.location_city, job.location_state, job.location_country].filter(Boolean).join(', ') || 'N/A'}`);
      console.log(`      Created At: ${job.created_at}`);
      console.log(`      Published At: ${job.published_at || 'Not published'}`);
      console.log('');
    });

    // Get applications for these jobs
    console.log('📝 APPLICATIONS FOR THESE JOBS:');
    const applicationsResult = await client.query(
      `SELECT 
        a.id as application_id,
        a.job_id,
        a.applicant_id,
        a.status,
        a.applied_at,
        a.match_score,
        j.title as job_title,
        u.email as applicant_email,
        ap.first_name,
        ap.last_name
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      LEFT JOIN users u ON a.applicant_id = u.id
      LEFT JOIN applicant_profiles ap ON u.id = ap.user_id
      WHERE a.job_id = ANY($1::uuid[])
      ORDER BY a.applied_at DESC`,
      [jobIds]
    );

    if (applicationsResult.rows.length === 0) {
      console.log('   ❌ No applications found\n');
    } else {
      console.log(`   Total Applications: ${applicationsResult.rows.length}\n`);

      // Group by applicant
      const applicantsMap = new Map();
      applicationsResult.rows.forEach((app) => {
        if (!applicantsMap.has(app.applicant_id)) {
          applicantsMap.set(app.applicant_id, {
            applicantId: app.applicant_id,
            email: app.applicant_email,
            name: `${app.first_name || ''} ${app.last_name || ''}`.trim() || 'N/A',
            applications: []
          });
        }
        applicantsMap.get(app.applicant_id).applications.push({
          applicationId: app.application_id,
          jobId: app.job_id,
          jobTitle: app.job_title,
          status: app.status,
          appliedAt: app.applied_at,
          matchScore: app.match_score
        });
      });

      console.log(`   Unique Applicants: ${applicantsMap.size}\n`);

      applicantsMap.forEach((applicant, applicantId) => {
        console.log(`   Applicant: ${applicant.name} (${applicant.email})`);
        console.log(`      Applicant ID: ${applicantId}`);
        console.log(`      Applications: ${applicant.applications.length}`);
        applicant.applications.forEach((app, idx) => {
          console.log(`         ${idx + 1}. ${app.jobTitle || 'N/A'} - Status: ${app.status} (Applied: ${app.appliedAt})`);
        });
        console.log('');
      });
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`   User: ${user.email}`);
    console.log(`   Jobs Posted: ${jobsResult.rows.length}`);
    console.log(`   Total Applications: ${applicationsResult.rows.length}`);
    console.log(`   Unique Applicants: ${applicantsMap ? applicantsMap.size : 0}`);
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await client.end();
  }
}

checkNgoApplicants();

