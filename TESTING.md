# Pairova Backend Testing Guide

This document outlines the comprehensive testing strategy for the Pairova backend API, ensuring all features meet requirements and function correctly.

## 🧪 Testing Overview

### **Testing Types**
- **Unit Tests**: Individual service and controller testing
- **Integration Tests**: API endpoint testing with database
- **End-to-End Tests**: Full application flow testing
- **Performance Tests**: Load and stress testing

### **Coverage Requirements**
- **Minimum Coverage**: 80% for branches, functions, lines, and statements
- **Critical Paths**: 95% coverage for authentication, payments, and core features
- **New Features**: 90% coverage requirement before deployment

## 🚀 Quick Start

### **Run All Tests**
```bash
# Run all tests (unit + integration)
npm run test:all

# Run with coverage
npm run test:cov

# Run in CI mode (no watch)
npm run test:ci
```

### **Run Specific Test Types**
```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Specific feature tests
npm run test:chat
npm run test:sms
npm run test:ai
npm run test:admin
```

### **Watch Mode**
```bash
# Watch unit tests
npm run test:watch

# Watch integration tests
npm run test:e2e:watch
```

## 📋 Test Categories

### **1. Authentication & Authorization**
- ✅ User registration and login
- ✅ JWT token generation and validation
- ✅ Role-based access control
- ✅ Password reset functionality
- ✅ OTP verification

**Test Files:**
- `src/auth/auth.service.spec.ts`
- `src/auth/auth.controller.spec.ts`
- `src/auth/strategies/jwt.strategy.spec.ts`

### **2. Enhanced Chat System**
- ✅ Conversation creation and management
- ✅ Real-time messaging
- ✅ File sharing functionality
- ✅ Message status tracking
- ✅ Typing indicators
- ✅ Online presence

**Test Files:**
- `src/messaging/services/enhanced-chat.service.spec.ts`
- `src/messaging/controllers/chat.controller.spec.ts`
- `test/chat.e2e-spec.ts`

### **3. SMS Provider Management**
- ✅ Multi-provider SMS system
- ✅ Automatic failover
- ✅ Health monitoring
- ✅ Cost tracking
- ✅ Admin configuration

**Test Files:**
- `src/sms/services/sms.service.spec.ts`
- `src/sms/services/sms-provider-factory.service.spec.ts`
- `src/sms/controllers/admin-sms.controller.spec.ts`

### **4. AI Microservice Integration**
- ✅ Job-applicant matching
- ✅ Score calculation
- ✅ Recommendation engine
- ✅ Batch processing
- ✅ Health checks

**Test Files:**
- `src/ai/services/ai-microservice.service.spec.ts`
- `src/ai/services/prediction-cache.service.spec.ts`
- `src/ai/ai.controller.spec.ts`

### **5. Admin Panel**
- ✅ Dashboard statistics
- ✅ User management
- ✅ Job management
- ✅ Application pipeline
- ✅ Feedback system
- ✅ Audit logging

**Test Files:**
- `src/admin/admin.controller.spec.ts`
- `src/admin/admin.service.spec.ts`
- `src/admin/users/admin-users.service.spec.ts`

### **6. Job Management**
- ✅ Job CRUD operations
- ✅ Application tracking
- ✅ Search and filtering
- ✅ Status management

**Test Files:**
- `src/jobs/jobs.service.spec.ts`
- `src/jobs/jobs.controller.spec.ts`
- `src/jobs/job-search/job-search.service.spec.ts`

### **7. User Management**
- ✅ Profile management
- ✅ File uploads
- ✅ Verification system
- ✅ Role management

**Test Files:**
- `src/users/applicant/applicant.service.spec.ts`
- `src/users/nonprofit/nonprofit.service.spec.ts`
- `src/profiles/uploads/upload.service.spec.ts`

## 🔧 Test Configuration

### **Environment Setup**
```bash
# Test environment variables
NODE_ENV=test
DATABASE_URL=postgresql://test:test@localhost:5432/pairova_test
JWT_SECRET=test-jwt-secret
AI_MICROSERVICE_URL=http://localhost:8001
```

### **Database Setup**
```bash
# Setup test database
npm run db:test:setup

# Seed test data
npm run db:test:seed
```

### **Mock Services**
- **AI Microservice**: Mocked for unit tests
- **SMS Providers**: Mocked with success/failure scenarios
- **Email Service**: Mocked with delivery simulation
- **File Upload**: Mocked Cloudinary responses

## 📊 Test Requirements Checklist

### **✅ Core Functionality**
- [ ] User registration and authentication
- [ ] Job posting and management
- [ ] Application submission and tracking
- [ ] Profile management and verification
- [ ] Real-time chat and messaging
- [ ] File sharing and uploads

### **✅ Admin Features**
- [ ] Dashboard statistics and analytics
- [ ] User management and moderation
- [ ] Job approval and management
- [ ] Application pipeline management
- [ ] Feedback collection and response
- [ ] Audit logging and monitoring

### **✅ Advanced Features**
- [ ] AI-powered job matching
- [ ] Multi-provider SMS system
- [ ] Real-time notifications
- [ ] WebSocket communication
- [ ] File upload and management
- [ ] Search and filtering

### **✅ Security & Performance**
- [ ] Authentication and authorization
- [ ] Input validation and sanitization
- [ ] Rate limiting and throttling
- [ ] Error handling and logging
- [ ] Database query optimization
- [ ] API response times

## 🎯 Test Scenarios

### **Authentication Flow**
1. User registers with valid data
2. User receives verification email
3. User verifies email and logs in
4. User receives JWT token
5. User accesses protected routes
6. Token expires and user re-authenticates

### **Chat System Flow**
1. User creates conversation
2. User sends message
3. Message is delivered in real-time
4. Recipient sees typing indicator
5. Recipient reads message
6. Message status updates

### **Job Application Flow**
1. NGO posts job
2. Job seeker applies
3. AI calculates match score
4. Application moves through pipeline
5. NGO reviews and responds
6. Status updates sent via notifications

### **SMS Provider Flow**
1. Admin configures SMS providers
2. System performs health checks
3. SMS is sent via primary provider
4. If primary fails, system tries backup
5. Delivery status is tracked
6. Costs are calculated and logged

## 📈 Performance Testing

### **Load Testing**
```bash
# Install artillery for load testing
npm install -g artillery

# Run load tests
artillery run test/load/chat-load-test.yml
artillery run test/load/api-load-test.yml
```

### **Stress Testing**
- **Concurrent Users**: 1000+ simultaneous users
- **Message Throughput**: 10,000+ messages per minute
- **API Response Time**: < 200ms for 95% of requests
- **Database Queries**: < 100ms for complex queries

## 🐛 Debugging Tests

### **Debug Unit Tests**
```bash
# Debug specific test
npm run test:debug -- --testNamePattern="should create conversation"

# Debug with breakpoints
npm run test:debug -- --testPathPattern="chat.service.spec.ts"
```

### **Debug Integration Tests**
```bash
# Debug e2e tests
npm run test:e2e -- --testNamePattern="should send message"
```

### **Test Logs**
```bash
# Enable verbose logging
DEBUG=* npm run test

# Enable specific debug logs
DEBUG=pairova:* npm run test
```

## 📝 Writing Tests

### **Unit Test Template**
```typescript
describe('ServiceName', () => {
  let service: ServiceName;
  let mockRepository: Repository<Entity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceName,
        {
          provide: getRepositoryToken(Entity),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ServiceName>(ServiceName);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('methodName', () => {
    it('should handle success case', async () => {
      // Arrange
      const input = { /* test data */ };
      const expected = { /* expected result */ };
      mockRepository.method.mockResolvedValue(expected);

      // Act
      const result = await service.methodName(input);

      // Assert
      expect(result).toEqual(expected);
      expect(mockRepository.method).toHaveBeenCalledWith(input);
    });

    it('should handle error case', async () => {
      // Arrange
      const input = { /* invalid data */ };
      mockRepository.method.mockRejectedValue(new Error('Test error'));

      // Act & Assert
      await expect(service.methodName(input)).rejects.toThrow('Test error');
    });
  });
});
```

### **Integration Test Template**
```typescript
describe('API Endpoint (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Setup test user and get auth token
    authToken = await setupTestUser();
  });

  it('should handle valid request', () => {
    return request(app.getHttpServer())
      .post('/api/endpoint')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ /* test data */ })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('expectedField');
      });
  });
});
```

## 🚨 Common Issues & Solutions

### **Database Connection Issues**
```bash
# Ensure test database is running
docker-compose -f database/docker-compose.yml up -d

# Reset test database
npm run db:test:setup
```

### **Mock Issues**
```typescript
// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Reset mock implementations
mockService.method.mockReset();
```

### **Async Test Issues**
```typescript
// Use proper async/await
it('should handle async operation', async () => {
  const result = await service.asyncMethod();
  expect(result).toBeDefined();
});

// Handle promises properly
it('should handle promise rejection', async () => {
  await expect(service.failingMethod()).rejects.toThrow('Expected error');
});
```

## 📊 Coverage Reports

### **View Coverage**
```bash
# Generate coverage report
npm run test:cov

# Open coverage report
open coverage/lcov-report/index.html
```

### **Coverage Thresholds**
- **Global**: 80% minimum
- **Critical Services**: 90% minimum
- **New Features**: 95% minimum

## 🔄 CI/CD Integration

### **GitHub Actions**
```yaml
- name: Run Tests
  run: |
    npm run test:ci
    npm run lint
    npm run build
```

### **Test Reports**
- **Coverage**: Uploaded to codecov
- **Test Results**: Published as artifacts
- **Performance**: Tracked over time

## 📚 Additional Resources

- **Jest Documentation**: https://jestjs.io/docs/getting-started
- **NestJS Testing**: https://docs.nestjs.com/fundamentals/testing
- **Supertest**: https://github.com/visionmedia/supertest
- **TypeORM Testing**: https://typeorm.io/testing

---

**Remember**: Good tests are the foundation of reliable software. Write tests that are:
- **Fast**: Run quickly and efficiently
- **Independent**: Don't depend on each other
- **Repeatable**: Same results every time
- **Self-validating**: Clear pass/fail results
- **Timely**: Written alongside the code
