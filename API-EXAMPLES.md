# Pairova API Examples

This document provides comprehensive examples for all major API endpoints to help frontend developers integrate quickly.

## 🔐 Authentication Examples

### 1. User Registration

```bash
curl -X POST https://server.pairova.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!",
    "role": "APPLICANT"
  }'
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "john.doe@example.com",
      "role": "APPLICANT",
      "isEmailVerified": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2. User Login

```bash
curl -X POST https://server.pairova.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "john.doe@example.com",
      "role": "APPLICANT",
      "profile": {
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 3. Get User Profile

```bash
curl -X GET https://server.pairova.com/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "role": "APPLICANT",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "location": "New York, NY",
      "bio": "Experienced software developer...",
      "skills": ["JavaScript", "React", "Node.js"],
      "resume": "https://storage.pairova.com/resumes/john-doe-resume.pdf"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 💼 Jobs Examples

### 1. Get All Jobs (Public)

```bash
curl -X GET "https://server.pairova.com/jobs?page=1&limit=20&search=developer"
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Jobs retrieved successfully",
  "data": [
    {
      "id": "job-123",
      "title": "Senior Software Developer",
      "description": "We are looking for a Senior Software Developer...",
      "placement": "REMOTE",
      "employmentType": "FULL_TIME",
      "salaryMin": 80000,
      "salaryMax": 120000,
      "currency": "USD",
      "locationCity": "San Francisco",
      "locationState": "CA",
      "locationCountry": "USA",
      "status": "PUBLISHED",
      "organization": {
        "id": "org-456",
        "name": "Tech for Good",
        "logo": "https://storage.pairova.com/logos/tech-for-good.png"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2. Create Job (Nonprofit Only)

```bash
curl -X POST https://server.pairova.com/jobs \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Frontend Developer",
    "description": "Join our team to build amazing user interfaces...",
    "placement": "HYBRID",
    "employmentType": "FULL_TIME",
    "experienceMinYrs": 3,
    "locationCity": "New York",
    "locationState": "NY",
    "locationCountry": "USA",
    "salaryMin": 70000,
    "salaryMax": 95000,
    "currency": "USD",
    "status": "DRAFT"
  }'
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "Job created successfully",
  "data": {
    "id": "job-789",
    "title": "Frontend Developer",
    "description": "Join our team to build amazing user interfaces...",
    "placement": "HYBRID",
    "employmentType": "FULL_TIME",
    "experienceMinYrs": 3,
    "locationCity": "New York",
    "locationState": "NY",
    "locationCountry": "USA",
    "salaryMin": 70000,
    "salaryMax": 95000,
    "currency": "USD",
    "status": "DRAFT",
    "organization": {
      "id": "org-456",
      "name": "Tech for Good"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 3. Apply to Job

```bash
curl -X POST https://server.pairova.com/jobs/job-123/apply \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "coverLetter": "I am excited to apply for this position...",
    "resume": "https://storage.pairova.com/resumes/john-doe-resume.pdf",
    "portfolio": "https://johndoe.dev"
  }'
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "Application submitted successfully",
  "data": {
    "id": "app-456",
    "jobId": "job-123",
    "applicantId": "123e4567-e89b-12d3-a456-426614174000",
    "coverLetter": "I am excited to apply for this position...",
    "resume": "https://storage.pairova.com/resumes/john-doe-resume.pdf",
    "portfolio": "https://johndoe.dev",
    "status": "SUBMITTED",
    "appliedAt": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 👤 User Profile Examples

### 1. Update Applicant Profile

```bash
curl -X PUT https://server.pairova.com/users/applicant/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "location": "New York, NY",
    "bio": "Experienced software developer with 5+ years in web development...",
    "skills": ["JavaScript", "React", "Node.js", "TypeScript", "Python"],
    "availability": "IMMEDIATE",
    "preferredWorkType": ["REMOTE", "HYBRID"],
    "expectedSalary": 90000,
    "currency": "USD"
  }'
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Profile updated successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "location": "New York, NY",
    "bio": "Experienced software developer with 5+ years in web development...",
    "skills": ["JavaScript", "React", "Node.js", "TypeScript", "Python"],
    "availability": "IMMEDIATE",
    "preferredWorkType": ["REMOTE", "HYBRID"],
    "expectedSalary": 90000,
    "currency": "USD",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2. Update Nonprofit Profile

```bash
curl -X PUT https://server.pairova.com/users/nonprofit/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "organizationName": "Tech for Good",
    "description": "We use technology to solve social problems...",
    "website": "https://techforgood.org",
    "phone": "+1234567890",
    "address": "123 Main St, San Francisco, CA 94105",
    "size": "MEDIUM",
    "industry": "Technology",
    "logo": "https://storage.pairova.com/logos/tech-for-good.png"
  }'
```

## 📁 File Upload Examples

### 1. Upload Resume

```bash
curl -X POST https://server.pairova.com/uploads \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "file=@/path/to/resume.pdf" \
  -F "type=resume"
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "File uploaded successfully",
  "data": {
    "id": "file-789",
    "filename": "john-doe-resume.pdf",
    "originalName": "resume.pdf",
    "url": "https://storage.pairova.com/resumes/john-doe-resume.pdf",
    "type": "resume",
    "size": 245760,
    "mimeType": "application/pdf",
    "uploadedAt": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2. Upload Profile Image

```bash
curl -X POST https://server.pairova.com/uploads \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "file=@/path/to/profile.jpg" \
  -F "type=image"
```

## 💬 Messaging Examples

### 1. Send Message

```bash
curl -X POST https://server.pairova.com/messaging/conversations/conv-123/messages \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Thank you for your interest in the position. When would be a good time to schedule an interview?",
    "type": "TEXT"
  }'
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "Message sent successfully",
  "data": {
    "id": "msg-456",
    "conversationId": "conv-123",
    "senderId": "123e4567-e89b-12d3-a456-426614174000",
    "message": "Thank you for your interest in the position. When would be a good time to schedule an interview?",
    "type": "TEXT",
    "sentAt": "2024-01-15T10:30:00Z",
    "readAt": null
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2. Schedule Interview

```bash
curl -X POST https://server.pairova.com/messaging/interviews/schedule \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "job-123",
    "applicantId": "123e4567-e89b-12d3-a456-426614174000",
    "scheduledAt": "2024-01-20T14:00:00Z",
    "duration": 60,
    "type": "VIDEO",
    "meetingLink": "https://meet.google.com/abc-defg-hij",
    "notes": "Technical interview focusing on React and Node.js"
  }'
```

## 🤖 AI Services Examples

### 1. Get Job Recommendations

```bash
curl -X GET https://server.pairova.com/ai/recommendations \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Recommendations generated successfully",
  "data": {
    "recommendations": [
      {
        "jobId": "job-123",
        "score": 0.95,
        "reasons": [
          "Skills match: JavaScript, React, Node.js",
          "Experience level matches requirements",
          "Location preference aligns with job location"
        ],
        "job": {
          "title": "Senior Software Developer",
          "organization": "Tech for Good",
          "placement": "REMOTE"
        }
      }
    ],
    "generatedAt": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2. Calculate Application Score

```bash
curl -X POST https://server.pairova.com/ai/score \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "job-123",
    "applicantId": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

## 🔧 Error Handling Examples

### 1. Validation Error

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "email must be a valid email address",
      "value": "invalid-email"
    },
    {
      "field": "password",
      "message": "password must be at least 8 characters long",
      "value": "123"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2. Authentication Error

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 3. Forbidden Error

```json
{
  "statusCode": 403,
  "message": "Access denied. Only nonprofit organizations can create jobs.",
  "error": "Forbidden",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 4. Not Found Error

```json
{
  "statusCode": 404,
  "message": "Job not found",
  "error": "Not Found",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🔄 WebSocket Examples

### 1. Connect to Chat

```javascript
const socket = io('https://server.pairova.com', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
});

// Join conversation
socket.emit('join_conversation', { conversationId: 'conv-123' });

// Send message
socket.emit('send_message', {
  conversationId: 'conv-123',
  message: 'Hello!'
});

// Listen for messages
socket.on('new_message', (message) => {
  console.log('New message:', message);
});
```

### 2. Real-time Notifications

```javascript
socket.on('notification', (notification) => {
  console.log('New notification:', notification);
  // Show toast notification
  showToast(notification.message, notification.type);
});
```

## 📊 Rate Limiting

All API endpoints have rate limiting:

- **Authentication endpoints**: 5 requests per minute
- **General API endpoints**: 100 requests per minute
- **File upload endpoints**: 10 requests per minute

When rate limited, you'll receive:

```json
{
  "statusCode": 429,
  "message": "Too many requests",
  "error": "Too Many Requests",
  "retryAfter": 60,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🛡️ Security Best Practices

1. **Always use HTTPS** in production
2. **Store tokens securely** (httpOnly cookies or secure storage)
3. **Implement token refresh** logic
4. **Validate all inputs** on the frontend
5. **Handle errors gracefully**
6. **Use proper CORS** configuration
7. **Implement request timeouts**
8. **Log security events**

This comprehensive guide should help frontend developers integrate with your API quickly and effectively! 🚀
