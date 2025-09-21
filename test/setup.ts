import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';

// Global test setup
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/pairova_test';
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.AI_MICROSERVICE_URL = 'http://localhost:8001'; // Mock AI service
});

// Global test cleanup
afterAll(async () => {
  // Cleanup any global resources
});

// Mock external services
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// Mock Socket.IO
jest.mock('socket.io', () => ({
  Server: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    to: jest.fn().mockReturnThis(),
    close: jest.fn(),
  })),
}));

// Mock SMS providers
jest.mock('../src/sms/services/sms-provider-factory.service', () => ({
  SmsProviderFactoryService: jest.fn().mockImplementation(() => ({
    createProvider: jest.fn().mockReturnValue({
      sendSms: jest.fn().mockResolvedValue({ success: true, messageId: 'test-msg-id' }),
      healthCheck: jest.fn().mockResolvedValue(true),
    }),
  })),
}));

// Mock email service
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-email-id' }),
    verify: jest.fn().mockResolvedValue(true),
  }),
}));

// Mock Cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        public_id: 'test-image',
        secure_url: 'https://res.cloudinary.com/test/test-image.jpg',
      }),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
    },
  },
}));

// Helper function to create test app
export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  
  // Apply same configuration as main app
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  });

  await app.init();
  return app;
}

// Helper function to get test database connection
export async function getTestDatabaseConnection() {
  // This would be used for database integration tests
  // Return a test database connection
}

// Helper function to seed test data
export async function seedTestData() {
  // Seed test data for integration tests
}

// Helper function to cleanup test data
export async function cleanupTestData() {
  // Clean up test data after tests
}
