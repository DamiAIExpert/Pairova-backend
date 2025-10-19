import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Pairova API')
    .setDescription(`
# Pairova Backend API Documentation

Welcome to the Pairova API! This comprehensive API powers the Pairova platform, connecting job seekers with nonprofit organizations.

## Quick Start

1. **Authentication**: Start by registering or logging in to get your access token
2. **Authorization**: Include the Bearer token in the Authorization header for protected endpoints
3. **Base URL**: Use the server URL shown above

## Authentication Flow

1. **Register** a new account or **Login** with existing credentials
2. Copy the access_token from the response
3. Include it in requests: Authorization: Bearer <your-token>

## Key Features

- **User Management**: Separate flows for job seekers and nonprofits
- **Job Posting**: Create, manage, and search job opportunities
- **Real-time Messaging**: Chat and interview scheduling
- **File Uploads**: Resume, documents, and profile images
- **AI Recommendations**: Smart job matching and scoring
- **Admin Panel**: Comprehensive management tools

## Response Formats

All responses follow a consistent format with statusCode, message, and data fields.

## WebSocket Support

Real-time features are available via WebSocket for chat messages and notifications.

## File Uploads

Supported file types: Images (JPG, PNG, GIF), Documents (PDF, DOC, DOCX), Resumes (PDF, DOC, DOCX)

## Rate Limiting

- Authentication: 5 attempts per minute
- API Calls: 100 requests per minute per user
- File Uploads: 10 uploads per minute

## Error Codes

- 400: Bad Request - Invalid input
- 401: Unauthorized - Invalid or missing token  
- 403: Forbidden - Insufficient permissions
- 404: Not Found - Resource doesn't exist
- 409: Conflict - Resource already exists
- 422: Validation Error - Invalid data format
- 429: Too Many Requests - Rate limit exceeded
- 500: Internal Server Error - Server issue

## Support

For API support and questions:
- Email: api-support@pairova.com
- Documentation: This Swagger UI
- Status Page: https://status.pairova.com
    `)
    .setVersion('1.0.0')
    .setContact(
      'Pairova API Support',
      'https://pairova.com/support',
      'api-support@pairova.com'
    )
    .setLicense(
      'MIT',
      'https://opensource.org/licenses/MIT'
    )
    .addServer(
      process.env.NODE_ENV === 'production' 
        ? 'https://server.pairova.com' 
        : 'http://localhost:3000',
      process.env.NODE_ENV === 'production' 
        ? 'Production Server' 
        : 'Development Server'
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Users', 'User management and profiles')
    .addTag('Jobs', 'Job posting and management')
    .addTag('Applications', 'Job application management')
    .addTag('NGO - Job Management', 'NGO-specific job posting and management')
    .addTag('NGO - Application Management', 'NGO-specific application management')
    .addTag('Job Seeker - Job Search & Applications', 'Job seeker-specific job search and applications')
    .addTag('Messaging', 'Real-time chat and communication')
    .addTag('Notifications', 'Email and push notifications')
    .addTag('File Uploads', 'Document and image uploads')
    .addTag('AI Services', 'AI-powered recommendations and scoring')
    .addTag('Admin', 'Administrative functions and management')
    .build();

  const doc = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('docs', app, doc, {
    swaggerOptions: { 
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      docExpansion: 'list', // Changed from 'none' to 'list' to show all endpoints
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      tagsSorter: 'alpha', // Sort tags alphabetically
      operationsSorter: 'alpha', // Sort operations alphabetically
    },
    customSiteTitle: 'Pairova API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .info .title { color: #2c3e50; }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 10px; border-radius: 4px; }
    `,
  });
}