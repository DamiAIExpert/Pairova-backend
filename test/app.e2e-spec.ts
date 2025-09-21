import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status', 'ok');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body).toHaveProperty('uptime');
      });
  });

  it('/api/docs (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/docs')
      .expect(200);
  });
});

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        role: 'APPLICANT',
        firstName: 'John',
        lastName: 'Doe',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'User registered successfully');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe(registerDto.email);
        });
    });

    it('should reject invalid email', () => {
      const registerDto = {
        email: 'invalid-email',
        password: 'password123',
        role: 'APPLICANT',
        firstName: 'John',
        lastName: 'Doe',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });

    it('should reject weak password', () => {
      const registerDto = {
        email: 'test@example.com',
        password: '123',
        role: 'APPLICANT',
        firstName: 'John',
        lastName: 'Doe',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      // Register a user first
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        role: 'APPLICANT',
        firstName: 'John',
        lastName: 'Doe',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);
    });

    it('should login with valid credentials', () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe(loginDto.email);
          authToken = res.body.access_token;
        });
    });

    it('should reject invalid credentials', () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });
  });
});

describe('Chat API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Register and login a user
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      role: 'APPLICANT',
      firstName: 'John',
      lastName: 'Doe',
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    authToken = loginResponse.body.access_token;
    userId = loginResponse.body.user.id;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/chat/conversations (GET)', () => {
    it('should get user conversations', () => {
      return request(app.getHttpServer())
        .get('/chat/conversations')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('conversations');
          expect(res.body).toHaveProperty('total');
          expect(Array.isArray(res.body.conversations)).toBe(true);
        });
    });

    it('should reject unauthenticated requests', () => {
      return request(app.getHttpServer())
        .get('/chat/conversations')
        .expect(401);
    });
  });

  describe('/chat/conversations (POST)', () => {
    it('should create a new conversation', () => {
      const createConversationDto = {
        type: 'DIRECT',
        title: 'Test Conversation',
        participantIds: [userId],
      };

      return request(app.getHttpServer())
        .post('/chat/conversations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createConversationDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('type', 'DIRECT');
          expect(res.body).toHaveProperty('title', 'Test Conversation');
        });
    });
  });
});

describe('SMS API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Register and login an admin user
    const registerDto = {
      email: 'admin@example.com',
      password: 'password123',
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123',
      });

    authToken = loginResponse.body.access_token;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/admin/sms/providers (GET)', () => {
    it('should get SMS providers (admin only)', () => {
      return request(app.getHttpServer())
        .get('/admin/sms/providers')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should reject non-admin requests', async () => {
      // Register a regular user
      const registerDto = {
        email: 'user@example.com',
        password: 'password123',
        role: 'APPLICANT',
        firstName: 'Regular',
        lastName: 'User',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'user@example.com',
          password: 'password123',
        });

      const userToken = loginResponse.body.access_token;

      return request(app.getHttpServer())
        .get('/admin/sms/providers')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('/admin/sms/providers (POST)', () => {
    it('should create a new SMS provider', () => {
      const createProviderDto = {
        providerType: 'TWILIO',
        name: 'Test Twilio Provider',
        configuration: {
          accountSid: 'test-sid',
          authToken: 'test-token',
          fromNumber: '+1234567890',
        },
        priority: 1,
        supportedCountries: ['US', 'CA'],
        supportedFeatures: ['SMS'],
      };

      return request(app.getHttpServer())
        .post('/admin/sms/providers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createProviderDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('providerType', 'TWILIO');
          expect(res.body).toHaveProperty('name', 'Test Twilio Provider');
        });
    });
  });
});

describe('AI API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Register and login a user
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      role: 'APPLICANT',
      firstName: 'John',
      lastName: 'Doe',
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    authToken = loginResponse.body.access_token;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/ai/calculate-score (POST)', () => {
    it('should calculate job-applicant match score', () => {
      const calculateScoreDto = {
        jobId: 'job-1',
        applicantId: 'applicant-1',
        jobData: {
          title: 'Software Developer',
          requirements: ['React', 'Node.js'],
          skills: ['JavaScript', 'TypeScript'],
        },
        applicantData: {
          skills: ['React', 'Node.js', 'JavaScript'],
          experience: '2 years',
          education: 'Computer Science',
        },
      };

      return request(app.getHttpServer())
        .post('/ai/calculate-score')
        .set('Authorization', `Bearer ${authToken}`)
        .send(calculateScoreDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('score');
          expect(res.body).toHaveProperty('scoreDetails');
          expect(res.body).toHaveProperty('modelVersion');
          expect(res.body).toHaveProperty('predictionSource');
          expect(typeof res.body.score).toBe('number');
          expect(res.body.score).toBeGreaterThanOrEqual(0);
          expect(res.body.score).toBeLessThanOrEqual(1);
        });
    });

    it('should reject invalid score calculation request', () => {
      const invalidDto = {
        jobId: 'invalid-job',
        applicantId: 'invalid-applicant',
      };

      return request(app.getHttpServer())
        .post('/ai/calculate-score')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('/ai/recommendations/:applicantId (GET)', () => {
    it('should get job recommendations for applicant', () => {
      return request(app.getHttpServer())
        .get('/ai/recommendations/test-applicant-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('recommendations');
          expect(res.body).toHaveProperty('totalJobs');
          expect(res.body).toHaveProperty('filteredJobs');
          expect(Array.isArray(res.body.recommendations)).toBe(true);
        });
    });
  });
});

describe('Admin API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Register and login an admin user
    const registerDto = {
      email: 'admin@example.com',
      password: 'password123',
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123',
      });

    authToken = loginResponse.body.access_token;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/admin/dashboard-stats (GET)', () => {
    it('should get dashboard statistics', () => {
      return request(app.getHttpServer())
        .get('/admin/dashboard-stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalUsers');
          expect(res.body).toHaveProperty('totalJobSeekers');
          expect(res.body).toHaveProperty('totalNGOs');
          expect(res.body).toHaveProperty('totalJobs');
          expect(res.body).toHaveProperty('totalApplications');
          expect(res.body).toHaveProperty('pendingApplications');
          expect(res.body).toHaveProperty('approvedApplications');
          expect(res.body).toHaveProperty('rejectedApplications');
          expect(typeof res.body.totalUsers).toBe('number');
          expect(typeof res.body.totalJobSeekers).toBe('number');
          expect(typeof res.body.totalNGOs).toBe('number');
        });
    });
  });

  describe('/admin/users (GET)', () => {
    it('should get paginated users', () => {
      return request(app.getHttpServer())
        .get('/admin/users?page=1&limit=20')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('users');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('limit');
          expect(Array.isArray(res.body.users)).toBe(true);
          expect(typeof res.body.total).toBe('number');
          expect(typeof res.body.page).toBe('number');
          expect(typeof res.body.limit).toBe('number');
        });
    });
  });

  describe('/admin/applications (GET)', () => {
    it('should get paginated applications', () => {
      return request(app.getHttpServer())
        .get('/admin/applications?page=1&limit=20')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('applications');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('limit');
          expect(Array.isArray(res.body.applications)).toBe(true);
        });
    });
  });

  describe('/admin/feedback (GET)', () => {
    it('should get paginated feedback', () => {
      return request(app.getHttpServer())
        .get('/admin/feedback?page=1&limit=20')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('feedback');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('limit');
          expect(Array.isArray(res.body.feedback)).toBe(true);
        });
    });
  });

  describe('/admin/audit/logs (GET)', () => {
    it('should get paginated audit logs', () => {
      return request(app.getHttpServer())
        .get('/admin/audit/logs?page=1&limit=20')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('logs');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('limit');
          expect(Array.isArray(res.body.logs)).toBe(true);
        });
    });
  });
});
