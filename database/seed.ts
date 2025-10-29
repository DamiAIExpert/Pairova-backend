// /database/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/shared/user.service';
import { Role } from '../src/common/enums/role.enum';
import { Gender } from '../src/common/enums/gender.enum';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { NonprofitOrg } from '../src/users/nonprofit/nonprofit.entity';
import { ApplicantProfile } from '../src/users/applicant/applicant.entity';
import { Job } from '../src/jobs/entities/job.entity';
import { JobStatus } from '../src/jobs/entities/job.entity';
import { EmploymentType } from '../src/common/enums/employment-type.enum';
import { JobPlacement } from '../src/common/enums/job.enum';

/**
 * @function bootstrap
 * @description A standalone NestJS application to seed the database with initial data.
 * This script is intended to be run from the command line (e.g., `npm run db:seed`).
 * It creates:
 * - 1 admin user
 * - 10 nonprofit organizations with realistic data and logos
 * - 3 job seekers/applicants
 * - 15 job postings (trending jobs)
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const configService = app.get(ConfigService);
  const dataSource = app.get(DataSource);
  const logger = new Logger('DatabaseSeed');

  logger.log('🌱 Starting database seeding process...');

  const defaultPassword = 'Password123!';
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(defaultPassword, salt);

  // ========== 1. CREATE ADMIN USER ==========
  const adminEmail = configService.get<string>('ADMIN_EMAIL', 'admin@pairova.com');
  const existingAdmin = await usersService.findByEmail(adminEmail);

  if (!existingAdmin) {
    await usersService.create({
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
      isVerified: true,
    });
    logger.log(`✅ Admin user created: ${adminEmail}`);
  } else {
    logger.log('⏭️  Admin user already exists. Skipping.');
  }

  // ========== 2. CREATE 10 NONPROFIT ORGANIZATIONS ==========
  const nonprofits = [
    {
      email: 'contact@redcross.org',
      orgName: 'American Red Cross',
      logoUrl: 'https://logo.clearbit.com/redcross.org',
      website: 'https://www.redcross.org',
      mission: 'The American Red Cross prevents and alleviates human suffering in the face of emergencies by mobilizing the power of volunteers and the generosity of donors.',
      values: 'Humanitarian, Compassionate, Stewardship, Collaborative, Volunteer-driven',
      sizeLabel: '500+ employees',
      orgType: 'Nonprofit',
      industry: 'Humanitarian Services',
      foundedOn: new Date('1881-05-21'),
      country: 'United States',
      state: 'Washington',
      city: 'Washington DC',
      addressLine1: '430 17th Street NW',
      latitude: 38.8977,
      longitude: -77.0365,
    },
    {
      email: 'info@habitat.org',
      orgName: 'Habitat for Humanity',
      logoUrl: 'https://logo.clearbit.com/habitat.org',
      website: 'https://www.habitat.org',
      mission: 'Seeking to put God\'s love into action, Habitat for Humanity brings people together to build homes, communities and hope.',
      values: 'Shelter, Advocacy, Volunteerism, Community Development',
      sizeLabel: '200-500 employees',
      orgType: 'Nonprofit',
      industry: 'Community Development',
      foundedOn: new Date('1976-09-26'),
      country: 'United States',
      state: 'Georgia',
      city: 'Atlanta',
      addressLine1: '285 Peachtree Center Ave NE',
      latitude: 33.7595,
      longitude: -84.3885,
    },
    {
      email: 'hello@kiva.org',
      orgName: 'Kiva Microfunds',
      logoUrl: 'https://logo.clearbit.com/kiva.org',
      website: 'https://www.kiva.org',
      mission: 'To expand financial access to help underserved communities thrive.',
      values: 'Dignity, Accountability, Transparency, Innovation',
      sizeLabel: '100-200 employees',
      orgType: 'Nonprofit',
      industry: 'Microfinance',
      foundedOn: new Date('2005-10-01'),
      country: 'United States',
      state: 'California',
      city: 'San Francisco',
      addressLine1: '986 Mission Street',
      latitude: 37.7821,
      longitude: -122.4093,
    },
    {
      email: 'jobs@teachforamerica.org',
      orgName: 'Teach For America',
      logoUrl: 'https://logo.clearbit.com/teachforamerica.org',
      website: 'https://www.teachforamerica.org',
      mission: 'One day, all children in this nation will have the opportunity to attain an excellent education.',
      values: 'Transformational change, Leadership, Team, Diversity, Respect',
      sizeLabel: '200-500 employees',
      orgType: 'Nonprofit',
      industry: 'Education',
      foundedOn: new Date('1989-01-01'),
      country: 'United States',
      state: 'New York',
      city: 'New York',
      addressLine1: '315 W 36th Street',
      latitude: 40.7536,
      longitude: -73.9918,
    },
    {
      email: 'contact@doctorswithoutborders.org',
      orgName: 'Doctors Without Borders',
      logoUrl: 'https://logo.clearbit.com/doctorswithoutborders.org',
      website: 'https://www.doctorswithoutborders.org',
      mission: 'Médecins Sans Frontières offers assistance to people based on need, irrespective of race, religion, gender, or political affiliation.',
      values: 'Independence, Neutrality, Medical ethics, Accountability',
      sizeLabel: '500+ employees',
      orgType: 'Nonprofit',
      industry: 'Healthcare',
      foundedOn: new Date('1971-12-22'),
      country: 'United States',
      state: 'New York',
      city: 'New York',
      addressLine1: '40 Rector Street',
      latitude: 40.7089,
      longitude: -74.0132,
    },
    {
      email: 'info@wwf.org',
      orgName: 'World Wildlife Fund',
      logoUrl: 'https://logo.clearbit.com/worldwildlife.org',
      website: 'https://www.worldwildlife.org',
      mission: 'WWF\'s mission is to conserve nature and reduce the most pressing threats to the diversity of life on Earth.',
      values: 'Integrity, Respect, Courage, Collaboration, Passion',
      sizeLabel: '200-500 employees',
      orgType: 'Nonprofit',
      industry: 'Environmental Conservation',
      foundedOn: new Date('1961-04-29'),
      country: 'United States',
      state: 'Washington',
      city: 'Washington DC',
      addressLine1: '1250 24th Street NW',
      latitude: 38.9047,
      longitude: -77.0503,
    },
    {
      email: 'careers@feedingamerica.org',
      orgName: 'Feeding America',
      logoUrl: 'https://logo.clearbit.com/feedingamerica.org',
      website: 'https://www.feedingamerica.org',
      mission: 'Our mission is to advance change in America by ensuring equitable access to nutritious food for all in partnership with food banks, policymakers, supporters, and the communities we serve.',
      values: 'Equity, Service, Community, Stewardship',
      sizeLabel: '100-200 employees',
      orgType: 'Nonprofit',
      industry: 'Food Security',
      foundedOn: new Date('1979-01-01'),
      country: 'United States',
      state: 'Illinois',
      city: 'Chicago',
      addressLine1: '161 N Clark Street',
      latitude: 41.8858,
      longitude: -87.6317,
    },
    {
      email: 'work@charitywater.org',
      orgName: 'charity: water',
      logoUrl: 'https://logo.clearbit.com/charitywater.org',
      website: 'https://www.charitywater.org',
      mission: 'We\'re a nonprofit organization bringing clean and safe drinking water to people around the world.',
      values: 'Innovation, Transparency, Sustainability, Impact',
      sizeLabel: '50-100 employees',
      orgType: 'Nonprofit',
      industry: 'Water & Sanitation',
      foundedOn: new Date('2006-09-01'),
      country: 'United States',
      state: 'New York',
      city: 'New York',
      addressLine1: '200 Varick Street',
      latitude: 40.7282,
      longitude: -74.0058,
    },
    {
      email: 'jobs@aclu.org',
      orgName: 'American Civil Liberties Union',
      logoUrl: 'https://logo.clearbit.com/aclu.org',
      website: 'https://www.aclu.org',
      mission: 'To defend and preserve the individual rights and liberties guaranteed to every person in this country by the Constitution and laws of the United States.',
      values: 'Liberty, Equality, Justice, Democracy',
      sizeLabel: '200-500 employees',
      orgType: 'Nonprofit',
      industry: 'Civil Rights',
      foundedOn: new Date('1920-01-19'),
      country: 'United States',
      state: 'New York',
      city: 'New York',
      addressLine1: '125 Broad Street',
      latitude: 40.7034,
      longitude: -74.0113,
    },
    {
      email: 'contact@savethechildren.org',
      orgName: 'Save the Children',
      logoUrl: 'https://logo.clearbit.com/savethechildren.org',
      website: 'https://www.savethechildren.org',
      mission: 'We believe every child deserves a future. We do whatever it takes for children – every day and in times of crisis.',
      values: 'Accountability, Ambition, Collaboration, Creativity, Integrity',
      sizeLabel: '500+ employees',
      orgType: 'Nonprofit',
      industry: 'Child Welfare',
      foundedOn: new Date('1919-05-15'),
      country: 'United States',
      state: 'Connecticut',
      city: 'Fairfield',
      addressLine1: '501 Kings Highway East',
      latitude: 41.1414,
      longitude: -73.2635,
    },
  ];

  const nonprofitUsers = [];
  for (const npo of nonprofits) {
    const existing = await usersService.findByEmail(npo.email);
    if (!existing) {
      const user = await usersService.create({
        email: npo.email,
        passwordHash,
        role: Role.NONPROFIT,
        isVerified: true,
      });

      const nonprofit = dataSource.getRepository(NonprofitOrg).create({
        userId: user.id,
        ...npo,
      });
      await dataSource.getRepository(NonprofitOrg).save(nonprofit);
      nonprofitUsers.push(user);
      logger.log(`✅ Created nonprofit: ${npo.orgName}`);
    } else {
      nonprofitUsers.push(existing);
      logger.log(`⏭️  Nonprofit already exists: ${npo.orgName}`);
    }
  }

  // ========== 3. SKIP APPLICANTS FOR NOW (Schema not fully synced) ==========
  /*
  const applicants = [
    {
      email: 'sarah.johnson@email.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      gender: Gender.FEMALE,
      dob: new Date('1995-03-15'),
      bio: 'Passionate community organizer with 5+ years of experience in nonprofit program management. Dedicated to creating positive social impact through grassroots initiatives.',
      country: 'United States',
      state: 'California',
      city: 'Los Angeles',
      photoUrl: 'https://i.pravatar.cc/300?img=5',
      portfolioUrl: 'https://linkedin.com/in/sarahjohnson',
      skills: ['Program Management', 'Community Outreach', 'Grant Writing', 'Event Planning', 'Social Media'],
      experienceLevel: 'MID',
      preferredEmploymentType: 'FULL_TIME',
    },
    {
      email: 'michael.chen@email.com',
      firstName: 'Michael',
      lastName: 'Chen',
      gender: Gender.MALE,
      dob: new Date('1992-08-22'),
      bio: 'Software engineer passionate about using technology for social good. Experience building platforms for nonprofits and social enterprises.',
      country: 'United States',
      state: 'New York',
      city: 'New York',
      photoUrl: 'https://i.pravatar.cc/300?img=12',
      portfolioUrl: 'https://github.com/michaelchen',
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Database Design', 'Web Development'],
      experienceLevel: 'SENIOR',
      preferredEmploymentType: 'PART_TIME',
    },
    {
      email: 'aisha.patel@email.com',
      firstName: 'Aisha',
      lastName: 'Patel',
      gender: Gender.FEMALE,
      dob: new Date('1998-11-30'),
      bio: 'Recent graduate with a degree in Public Health. Eager to contribute to health equity initiatives and community wellness programs.',
      country: 'United States',
      state: 'Texas',
      city: 'Austin',
      photoUrl: 'https://i.pravatar.cc/300?img=9',
      portfolioUrl: 'https://linkedin.com/in/aishapatel',
      skills: ['Public Health', 'Research', 'Data Analysis', 'Health Education', 'Spanish Language'],
      experienceLevel: 'ENTRY',
      preferredEmploymentType: 'VOLUNTEER',
    },
  ];

  for (const applicant of applicants) {
    const existing = await usersService.findByEmail(applicant.email);
    if (!existing) {
      const user = await usersService.create({
        email: applicant.email,
        passwordHash,
        role: Role.APPLICANT,
        isVerified: true,
      });

      // Create applicant profile using direct SQL to avoid entity issues
      await dataSource.query(`
        INSERT INTO applicant_profiles 
        (user_id, first_name, last_name, gender, dob, bio, country, state, city, photo_url, portfolio_url, skills, experience_level, preferred_employment_type)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `, [
        user.id,
        applicant.firstName,
        applicant.lastName,
        applicant.gender,
        applicant.dob,
        applicant.bio,
        applicant.country,
        applicant.state,
        applicant.city,
        applicant.photoUrl,
        applicant.portfolioUrl,
        applicant.skills,
        applicant.experienceLevel,
        applicant.preferredEmploymentType,
      ]);
      logger.log(`✅ Created applicant: ${applicant.firstName} ${applicant.lastName}`);
  } else {
      logger.log(`⏭️  Applicant already exists: ${applicant.firstName} ${applicant.lastName}`);
    }
  }
  */
  logger.log('⏭️  Skipping applicants - schema sync needed');

  // ========== 4. CREATE JOB POSTINGS ==========
  const jobTemplates = [
    {
      title: 'Community Outreach Coordinator',
      description: 'Join our team to engage with local communities and build partnerships that create lasting impact. You will develop outreach strategies, organize community events, and serve as a liaison between our organization and the communities we serve.',
      employmentType: EmploymentType.FULL_TIME,
      placement: JobPlacement.HYBRID,
      experienceMinYrs: 2,
      salaryMin: 45000,
      salaryMax: 60000,
      requiredSkills: ['Communication', 'Community Engagement', 'Event Planning'],
      benefits: ['Health Insurance', 'Paid Time Off', 'Professional Development'],
    },
    {
      title: 'Volunteer Program Manager',
      description: 'Lead and coordinate our volunteer programs, recruit and train volunteers, and ensure meaningful engagement opportunities. This role is perfect for someone passionate about building strong volunteer communities.',
      employmentType: EmploymentType.FULL_TIME,
      placement: JobPlacement.ONSITE,
      experienceMinYrs: 3,
      salaryMin: 50000,
      salaryMax: 65000,
      requiredSkills: ['Volunteer Management', 'Leadership', 'Training & Development'],
      benefits: ['Health Insurance', '401k Match', 'Flexible Schedule'],
    },
    {
      title: 'Social Media Volunteer',
      description: 'Help us spread our message and engage with supporters online! As a social media volunteer, you\'ll create content, manage our social media presence, and help grow our online community.',
      employmentType: EmploymentType.VOLUNTEER,
      placement: JobPlacement.REMOTE,
      experienceMinYrs: 0,
      requiredSkills: ['Social Media', 'Content Creation', 'Graphic Design'],
      benefits: ['Remote Work', 'Flexible Hours', 'Letter of Recommendation'],
    },
    {
      title: 'Fundraising Specialist',
      description: 'Develop and implement fundraising strategies to support our mission. Work with donors, write grant proposals, and plan fundraising events to secure vital resources for our programs.',
      employmentType: EmploymentType.PART_TIME,
      placement: JobPlacement.HYBRID,
      experienceMinYrs: 2,
      salaryMin: 30000,
      salaryMax: 40000,
      requiredSkills: ['Grant Writing', 'Donor Relations', 'Fundraising'],
      benefits: ['Flexible Schedule', 'Professional Development'],
    },
    {
      title: 'Program Intern',
      description: 'Gain hands-on experience in nonprofit program management. Support our team in program implementation, data collection, and community engagement activities. Perfect for students or recent graduates.',
      employmentType: EmploymentType.INTERNSHIP,
      placement: JobPlacement.ONSITE,
      experienceMinYrs: 0,
      salaryMin: 15,
      salaryMax: 20,
      requiredSkills: ['Research', 'Communication', 'Microsoft Office'],
      benefits: ['Mentorship', 'Networking Opportunities', 'Course Credit Available'],
    },
  ];

  const jobRepo = dataSource.getRepository(Job);
  let jobsCreated = 0;

  // Create 15 jobs (3 jobs per nonprofit for first 5 organizations)
  for (let i = 0; i < Math.min(5, nonprofitUsers.length); i++) {
    for (let j = 0; j < 3; j++) {
      const template = jobTemplates[j % jobTemplates.length];
      const job = jobRepo.create({
        title: template.title,
        description: template.description,
        employmentType: template.employmentType,
        placement: template.placement,
        experienceMinYrs: template.experienceMinYrs,
        salaryMin: template.salaryMin,
        salaryMax: template.salaryMax,
        currency: 'USD',
        requiredSkills: template.requiredSkills,
        benefits: template.benefits,
        status: JobStatus.PUBLISHED,
        postedById: nonprofitUsers[i].id,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      });

      await jobRepo.save(job);
      jobsCreated++;
    }
  }

  logger.log(`✅ Created ${jobsCreated} job postings`);

  await app.close();
  logger.log('🎉 Seeding process completed successfully!');
  logger.log(`\n📝 Default credentials for all users: ${defaultPassword}`);
}

bootstrap().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
