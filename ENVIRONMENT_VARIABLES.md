# Environment Variables Configuration Guide

This document outlines all required and optional environment variables for the Pairova backend to work with the live frontend.

## 🔴 **REQUIRED for Production (Live Frontend)**

### Frontend URLs
```bash
# Main frontend URL (required for production)
CLIENT_URL=https://your-frontend-domain.com

# Admin frontend URL (if separate, optional)
ADMIN_URL=https://admin.your-frontend-domain.com

# Environment
NODE_ENV=production
```

### Database
```bash
# Either use DATABASE_URL (recommended) or individual connection params
DATABASE_URL=postgresql://user:password@host:port/database

# OR individual connection parameters
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
DB_DATABASE=your-db-name
```

### JWT Authentication
```bash
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=7d
```

### Session (for OAuth)
```bash
SESSION_SECRET=your-session-secret-key
```

## 🟡 **OPTIONAL but Recommended**

### Email Service (SMTP)
```bash
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
SMTP_FROM=Pairova <noreply@pairova.com>
SMTP_SECURE=false  # true for port 465, false for port 587
```

### Cloudinary (File Storage)
```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### OAuth Providers
```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

### Server Configuration
```bash
PORT=3007  # Default: 3000
```

## 📋 **CORS Configuration**

The backend automatically configures CORS based on environment:

### Development Mode (`NODE_ENV=development`)
- Automatically allows:
  - `http://localhost:5173`
  - `http://localhost:3000`
  - `http://localhost:3001`
  - `http://127.0.0.1:5173`

### Production Mode (`NODE_ENV=production`)
- Uses `CLIENT_URL` and `ADMIN_URL` environment variables
- Supports comma-separated URLs: `CLIENT_URL=https://app1.com,https://app2.com`
- Fallback: `https://pairova.com` and `https://admin.pairova.com` if not set

## 🔧 **WebSocket CORS**

All WebSocket gateways (chat, notifications) use the same CORS configuration as the main HTTP server, ensuring consistent access control.

## ✅ **Verification Checklist**

Before deploying to production, ensure:

- [ ] `NODE_ENV=production` is set
- [ ] `CLIENT_URL` is set to your live frontend URL
- [ ] `ADMIN_URL` is set (if you have a separate admin frontend)
- [ ] Database connection is configured
- [ ] JWT secrets are set and secure
- [ ] SMTP is configured (for email functionality)
- [ ] Cloudinary is configured (for file uploads)
- [ ] OAuth providers are configured (if using social login)

## 🚨 **Security Notes**

1. **Never commit `.env` files** to version control
2. **Use strong, unique secrets** for JWT and session
3. **Restrict CORS** to only your frontend domains in production
4. **Use HTTPS** in production for all URLs
5. **Keep secrets secure** and rotate them periodically

## 📝 **Example `.env` File**

```bash
# Environment
NODE_ENV=production

# Frontend URLs
CLIENT_URL=https://pairova.com
ADMIN_URL=https://admin.pairova.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/pairova

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-refresh-token-secret-change-this
REFRESH_TOKEN_EXPIRES_IN=7d

# Session
SESSION_SECRET=your-session-secret-change-this

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@pairova.com
SMTP_PASS=your-email-password
SMTP_FROM=Pairova <noreply@pairova.com>
SMTP_SECURE=false

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Server
PORT=3007
```

