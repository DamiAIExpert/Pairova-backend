# Pairova Backend API

Welcome to the official backend repository for **Pairova**, a robust, AI-powered platform designed to connect job seekers with non-profit organizations. Built with a production-ready, scalable architecture using **NestJS**, this API serves as the backbone for all user management, job postings, real-time communication, administrative functions, and intelligent job matching.

---

## ✨ Features

This backend provides a comprehensive set of features, structured into clean, modular components:

### 🔐 Authentication & Authorization
- **JWT-based Authentication**: Secure token-based authentication system
- **Role-based Access Control**: Admin, Applicant, and Nonprofit roles with granular permissions
- **OTP Verification**: Email and SMS-based verification flows
- **Session Management**: Automatic token refresh and session persistence

### 👤 User & Profile Management
- **Multi-role User System**: Distinct flows for Applicants and Non-Profit Organizations
- **Complete Profile Building**: Education, Experience, and Certification management
- **Profile Verification**: Admin-controlled user verification system
- **File Upload Integration**: Cloudinary integration for resumes and profile photos

### 📋 Job & Application Lifecycle
- **Advanced Job Management**: Full CRUD operations with rich job descriptions
- **Application Pipeline**: Complete tracking from submission to hiring
- **Status Management**: Automated workflow with manual admin controls
- **Application Analytics**: Detailed statistics and performance metrics

### 🤖 AI-Powered Matching System
- **Microservice Architecture**: Separate AI service for ML predictions
- **Intelligent Scoring**: Job-applicant compatibility scoring with detailed breakdowns
- **Smart Recommendations**: Personalized job recommendations based on profile analysis
- **Prediction Caching**: 24-hour cache with fallback strategies for performance
- **Match Insights**: Detailed compatibility analysis and improvement suggestions

### 📱 Multi-Provider SMS System
- **7 SMS Providers**: Twilio, Clickatell, MSG91, Africastalking, Nexmo, CM.com, Telesign
- **Automatic Failover**: Smart routing when providers are unavailable
- **Health Monitoring**: Real-time provider status and performance tracking
- **Cost Optimization**: Monitor and optimize SMS costs across providers
- **Global Coverage**: Regional provider optimization for better delivery

### 👑 Admin Panel & Management
- **Dashboard Analytics**: Real-time statistics and performance metrics
- **User Management**: Complete CRUD operations for all user types
- **Application Pipeline**: Visual workflow management and status tracking
- **Feedback System**: User feedback collection and moderation tools
- **Audit Logging**: Comprehensive system activity tracking
- **Settings Management**: Email, SMS, and CMS configuration

### 💬 Real-Time Communication
- **WebSocket Chat**: Live messaging between applicants and NGOs
- **Interview Scheduling**: Integrated interview management system
- **Notification System**: Multi-channel notifications (Email, SMS, In-app)
- **Real-time Updates**: Live status updates and activity feeds

### 📚 Advanced Features
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Database Migrations**: Version-controlled database schema management
- **Error Handling**: Comprehensive error handling with logging
- **Performance Monitoring**: Built-in performance tracking and optimization
- **Security**: CSRF protection, rate limiting, and secure headers

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later recommended)
- **npm**, **yarn**, or **pnpm**
- **PostgreSQL** (v13 or later)
- **AI Microservice** (Python/FastAPI recommended)
- **Docker** and **Docker Compose** (optional, for easy database setup)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd pairova-backend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Application
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/pairova
# OR use discrete credentials:
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=pairova
DB_SYNCHRONIZE=false # Always false in production

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d

# AI Microservice Configuration
AI_MICROSERVICE_URL=http://localhost:8000
AI_MICROSERVICE_API_KEY=your-ai-microservice-api-key
AI_MICROSERVICE_TIMEOUT=30000
AI_MICROSERVICE_RETRY_ATTEMPTS=3

# SMS Provider Configuration (Optional)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_FROM_NUMBER=+1234567890

CLICKATELL_API_KEY=your-clickatell-api-key
MSG91_AUTH_KEY=your-msg91-auth-key
MSG91_SENDER_ID=PAIROVA
MSG91_ROUTE=4

AFRICASTALKING_USERNAME=your-africastalking-username
AFRICASTALKING_API_KEY=your-africastalking-api-key

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Pairova <noreply@pairova.com>"

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### 4. Database Setup

#### Option A: Docker (Recommended for Development)

```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d

# Run database migrations
npm run migration:run
```

#### Option B: Local PostgreSQL

```bash
# Create database
createdb pairova

# Run migrations
npm run migration:run
```

### 5. AI Microservice Setup

The Pairova backend requires an AI microservice for intelligent job matching. Set up your AI service to run on `http://localhost:8000` with the following endpoints:

```python
# Required AI microservice endpoints
POST /api/v1/predictions/score        # Calculate job-applicant match scores
POST /api/v1/predictions/batch-score  # Batch score calculations
POST /api/v1/recommendations          # Get job recommendations
GET /health                           # Health check endpoint
GET /status                           # Service status and version
```

### 6. Start the Application

```bash
# Development mode with hot-reloading
npm run start:dev

# Production mode
npm run start:prod

# Run tests
npm run test

# Run linting
npm run lint
```

### 7. Verify Installation

Once running, verify the installation:

- **API Base URL**: [http://localhost:3001](http://localhost:3001)
- **Swagger Documentation**: [http://localhost:3001/docs](http://localhost:3001/docs)
- **Health Check**: [http://localhost:3001/health](http://localhost:3001/health)

---

## 🏗️ Architecture Overview

### Microservice Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │  AI Microservice│
│   (React/Next)  │◄──►│   (NestJS)      │◄──►│   (Python/ML)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │                 │
                       │ • User Data     │
                       │ • Job Listings  │
                       │ • Applications  │
                       │ • AI Predictions│
                       │ • SMS Logs      │
                       │ • Audit Logs    │
                       └─────────────────┘
```

### Core Modules

- **Authentication Module**: JWT-based auth with role management
- **User Management**: Applicant and NGO profile management
- **Job Management**: Job postings and application tracking
- **AI Integration**: Intelligent matching and recommendations
- **SMS Management**: Multi-provider SMS with failover
- **Admin Panel**: Comprehensive administrative functions
- **Real-time Communication**: WebSocket-based chat and notifications
- **File Management**: Cloudinary integration for uploads

---

## 📊 Database Schema

The database uses PostgreSQL with the following key entities:

### Core Entities
- **users**: Base user accounts with role-based access
- **applicant_profiles**: Detailed applicant information
- **nonprofit_orgs**: NGO organization profiles
- **jobs**: Job postings with rich metadata
- **applications**: Job application tracking

### AI & Analytics
- **recommendation_scores**: AI-generated match scores with caching
- **feedback**: User feedback and platform insights
- **audit_log**: System activity tracking

### Communication
- **sms_providers**: SMS provider configurations
- **sms_logs**: SMS delivery tracking and analytics
- **messages**: Real-time chat messages
- **notifications**: Multi-channel notification system

### Profile Building
- **education**: Applicant education history
- **experience**: Work experience records
- **certifications**: Professional certifications
- **uploads**: File upload management

---

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout
- `POST /auth/verify-email` - Email verification
- `POST /auth/verify-phone` - Phone verification

### User Management
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/applicant/profile` - Get applicant profile
- `PUT /users/applicant/profile` - Update applicant profile
- `GET /users/nonprofit/profile` - Get NGO profile
- `PUT /users/nonprofit/profile` - Update NGO profile

### Job Management
- `GET /jobs` - List jobs with filtering
- `POST /jobs` - Create job posting
- `GET /jobs/:id` - Get job details
- `PUT /jobs/:id` - Update job posting
- `DELETE /jobs/:id` - Delete job posting
- `POST /jobs/:id/apply` - Submit job application
- `GET /applications` - Get user applications

### AI & Recommendations
- `POST /ai/calculate-score` - Calculate job-applicant match score
- `GET /ai/recommendations/:applicantId` - Get job recommendations
- `GET /ai/match-insights/:applicantId` - Get match insights
- `GET /ai/top-candidates/:jobId` - Get top candidates for job

### SMS Management
- `GET /admin/sms/providers` - List SMS providers
- `POST /admin/sms/providers` - Create SMS provider
- `PUT /admin/sms/providers/:id` - Update SMS provider
- `POST /admin/sms/providers/:id/health-check` - Health check
- `GET /admin/sms/logs` - SMS message logs
- `GET /admin/sms/statistics` - SMS statistics

### Admin Panel
- `GET /admin/dashboard-stats` - Dashboard statistics
- `GET /admin/users` - User management
- `GET /admin/applications` - Application management
- `GET /admin/feedback` - Feedback management
- `GET /admin/audit/logs` - Audit logs

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

---

## 📈 Performance & Monitoring

### Built-in Monitoring
- **Health Checks**: Endpoint health monitoring
- **Performance Metrics**: Response time tracking
- **Error Tracking**: Comprehensive error logging
- **Database Monitoring**: Query performance tracking

### Optimization Features
- **Caching**: Redis integration for session and data caching
- **Connection Pooling**: Optimized database connections
- **Rate Limiting**: API rate limiting and throttling
- **Compression**: Response compression for better performance

---

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Role-based Access**: Granular permission system
- **Password Hashing**: bcrypt password encryption
- **Session Management**: Secure session handling

### API Security
- **CORS Protection**: Configurable cross-origin policies
- **Rate Limiting**: API abuse prevention
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Content Security Policy headers

---

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   # Set production environment variables
   NODE_ENV=production
   DATABASE_URL=postgresql://user:pass@host:port/db
   JWT_SECRET=your-production-secret
   ```

2. **Database Migration**
   ```bash
   npm run migration:run
   ```

3. **Build Application**
   ```bash
   npm run build
   npm run start:prod
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

### Environment Variables

Ensure all required environment variables are set:
- Database configuration
- JWT secrets
- AI microservice URLs
- SMS provider credentials
- Email service configuration
- Cloudinary credentials

---

## 📚 API Documentation

### Swagger/OpenAPI
Access the interactive API documentation at `/docs` when running the application. This provides:
- Complete endpoint documentation
- Request/response schemas
- Authentication requirements
- Example requests and responses

### Postman Collection
A Postman collection is available for testing all API endpoints with pre-configured requests and authentication.

---

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Install dependencies: `npm install`
4. Set up environment variables
5. Run tests: `npm test`
6. Make your changes
7. Submit a pull request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Airbnb configuration
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages
- **Testing**: Unit and integration tests required

---

## 📞 Support

### Documentation
- **API Documentation**: Available at `/docs` endpoint
- **Database Schema**: ERD diagrams in `/docs/schema`
- **Architecture Guides**: Detailed setup and configuration guides

### Contact
- **Issues**: GitHub Issues for bug reports and feature requests
- **Discussions**: GitHub Discussions for questions and community support
- **Email**: technical@pairova.com for direct support

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NestJS** - Progressive Node.js framework
- **TypeORM** - Object-relational mapping
- **PostgreSQL** - Robust database system
- **Swagger** - API documentation
- **Cloudinary** - Cloud-based media management
- **AI/ML Community** - Open-source machine learning libraries

---

**Built with ❤️ by the Pairova Team**