/**
 * Script to check database directly for user profile data
 * Usage: node check-user-data.js <email>
 * Example: node check-user-data.js damitobex7@gmail.com
 */

require('dotenv').config();
const { Client } = require('pg');

const email = process.argv[2] || 'damitobex7@gmail.com';

// Get database connection from environment
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

async function checkUserData() {
  const client = new Client(getDbConfig());
  
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Find user by email
    console.log(`🔍 Looking for user: ${email}\n`);
    const userResult = await client.query(
      'SELECT id, email, role FROM users WHERE email = $1',
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
    console.log(`   Role: ${user.role}\n`);

    // Get profile
    const profileResult = await client.query(
      'SELECT * FROM applicant_profiles WHERE user_id = $1',
      [user.id]
    );
    
    if (profileResult.rows.length > 0) {
      const profile = profileResult.rows[0];
      console.log('📌 PROFILE DATA:');
      console.log(`   First Name: ${profile.first_name || 'N/A'}`);
      console.log(`   Last Name: ${profile.last_name || 'N/A'}`);
      console.log(`   Work Position: ${profile.work_position || 'N/A'}`);
      console.log(`   Country: ${profile.country || 'N/A'}`);
      console.log(`   City: ${profile.city || 'N/A'}`);
      console.log(`   State: ${profile.state || 'N/A'}`);
      console.log(`   Postal Code: ${profile.postal_code || 'N/A'}`);
      console.log(`   Bio: ${profile.bio || 'N/A'}`);
      console.log(`   Skills: ${profile.skills ? JSON.stringify(profile.skills) : 'N/A'}\n`);
    }

    // Get education entries
    console.log('🎓 EDUCATION ENTRIES:');
    const educationResult = await client.query(
      'SELECT * FROM educations WHERE "userId" = $1 ORDER BY "createdAt"',
      [user.id]
    );
    
    console.log(`   Total: ${educationResult.rows.length} entries\n`);
    
    if (educationResult.rows.length > 0) {
      educationResult.rows.forEach((edu, index) => {
        console.log(`   Entry ${index + 1}:`);
        console.log(`      ID: ${edu.id}`);
        console.log(`      School: ${edu.school || 'N/A'}`);
        console.log(`      Degree: ${edu.degree || 'N/A'}`);
        console.log(`      Field of Study: ${edu.field_of_study || 'N/A'}`);
        console.log(`      Grade: ${edu.grade || 'N/A'}`);
        console.log(`      Role: ${edu.role || 'N/A'}`);
        console.log(`      Description: ${edu.description || 'N/A'}`);
        console.log(`      Start Date: ${edu.startDate || 'N/A'}`);
        console.log(`      End Date: ${edu.endDate || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('   No education entries found\n');
    }

    // Check for duplicates
    const schools = educationResult.rows.map(e => e.school).filter(Boolean);
    const uniqueSchools = [...new Set(schools)];
    if (schools.length !== uniqueSchools.length) {
      console.log('⚠️  DUPLICATE EDUCATION ENTRIES DETECTED!');
      console.log(`   Found ${schools.length} entries, but only ${uniqueSchools.length} unique schools`);
      const duplicates = schools.filter((school, index) => schools.indexOf(school) !== index);
      console.log(`   Duplicate schools: ${[...new Set(duplicates)].join(', ')}\n`);
    }

    // Get experience entries
    console.log('💼 EXPERIENCE ENTRIES:');
    const experienceResult = await client.query(
      'SELECT * FROM experiences WHERE "userId" = $1 ORDER BY "createdAt"',
      [user.id]
    );
    
    console.log(`   Total: ${experienceResult.rows.length} entries\n`);
    
    if (experienceResult.rows.length > 0) {
      experienceResult.rows.forEach((exp, index) => {
        console.log(`   Entry ${index + 1}:`);
        console.log(`      ID: ${exp.id}`);
        console.log(`      Company: ${exp.company || 'N/A'}`);
        console.log(`      Role Title: ${exp.roleTitle || 'N/A'}`);
        console.log(`      Employment Type: ${exp.employmentType || 'N/A'}`);
        console.log(`      Start Date: ${exp.startDate || 'N/A'}`);
        console.log(`      End Date: ${exp.endDate || 'Currently Working'}`);
        console.log(`      Location City: ${exp.locationCity || 'N/A'}`);
        console.log(`      Location State: ${exp.locationState || 'N/A'}`);
        console.log(`      Location Country: ${exp.locationCountry || 'N/A'}`);
        console.log(`      Postal Code: ${exp.postal_code || 'N/A'}`);
        console.log(`      Description: ${exp.description || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('   No experience entries found\n');
    }

    // Check for duplicates
    const companies = experienceResult.rows.map(e => e.company).filter(Boolean);
    const uniqueCompanies = [...new Set(companies)];
    if (companies.length !== uniqueCompanies.length) {
      console.log('⚠️  DUPLICATE EXPERIENCE ENTRIES DETECTED!');
      console.log(`   Found ${companies.length} entries, but only ${uniqueCompanies.length} unique companies`);
      const duplicates = companies.filter((company, index) => companies.indexOf(company) !== index);
      console.log(`   Duplicate companies: ${[...new Set(duplicates)].join(', ')}\n`);
    }

    // Get certification entries
    console.log('🏆 CERTIFICATION ENTRIES:');
    const certificationResult = await client.query(
      'SELECT * FROM certifications WHERE "userId" = $1 ORDER BY "issueDate" DESC',
      [user.id]
    );
    
    console.log(`   Total: ${certificationResult.rows.length} entries\n`);
    
    if (certificationResult.rows.length > 0) {
      certificationResult.rows.forEach((cert, index) => {
        console.log(`   Entry ${index + 1}:`);
        console.log(`      ID: ${cert.id}`);
        console.log(`      Name: ${cert.name || 'N/A'}`);
        console.log(`      Issuer: ${cert.issuer || 'N/A'}`);
        console.log(`      Issue Date: ${cert.issueDate || cert.issuedDate || 'N/A'}`);
        console.log(`      Credential ID: ${cert.credentialId || 'N/A'}`);
        console.log(`      Credential URL: ${cert.credentialUrl || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('   No certification entries found\n');
    }

    // Summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Education Entries: ${educationResult.rows.length} (Expected: 8) ${educationResult.rows.length === 8 ? '✅' : '❌'}`);
    console.log(`Experience Entries: ${experienceResult.rows.length} (Expected: 7) ${experienceResult.rows.length === 7 ? '✅' : '❌'}`);
    console.log(`Certification Entries: ${certificationResult.rows.length} (Expected: 1) ${certificationResult.rows.length === 1 ? '✅' : '❌'}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    // Raw data export
    console.log('📦 RAW DATA (for inspection):');
    console.log(JSON.stringify({
      profile: profileResult.rows[0] || null,
      educations: educationResult.rows,
      experiences: experienceResult.rows,
      certifications: certificationResult.rows
    }, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n✅ Database connection closed');
  }
}

// Run the check
checkUserData().catch(console.error);







