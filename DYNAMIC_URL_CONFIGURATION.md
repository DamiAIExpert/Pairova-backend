# Dynamic URL Configuration Guide

## Overview

The Pairova backend now supports **dynamic URL configuration** that automatically adapts to different environments (development, production) and supports multiple frontend domains (main app, admin panel).

## Features

✅ **Environment-based URL resolution**
- Development: Automatically uses `http://localhost:5173`
- Production: Uses configured production URLs

✅ **Multi-domain support**
- Main app: `https://pairova.com`
- Admin panel: `https://admin.pairova.com`

✅ **Role-based routing**
- Admin users → Admin URL
- Regular users → Main app URL

✅ **Dynamic CORS configuration**
- Automatically configures allowed origins based on environment

## Environment Variables

### Development (.env)

```env
NODE_ENV=development
PORT=3007
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:3001
```

### Production (.env)

```env
NODE_ENV=production
PORT=3000
CLIENT_URL=https://pairova.com
ADMIN_URL=https://admin.pairova.com
```

### Multiple Domains (Optional)

You can specify multiple domains using comma separation:

```env
CLIENT_URL=https://pairova.com,https://www.pairova.com
ADMIN_URL=https://admin.pairova.com,https://www.admin.pairova.com
```

## How It Works

### 1. URL Helper Service

The `UrlHelper` class (`src/common/utils/url.helper.ts`) provides centralized URL management:

```typescript
// Get frontend URL based on environment
const url = UrlHelper.getFrontendUrl(configService);

// Get frontend URL for admin
const adminUrl = UrlHelper.getFrontendUrl(configService, true);

// Get frontend URL by user role
const url = UrlHelper.getFrontendUrlByRole(configService, 'admin');

// Get all allowed CORS origins
const origins = UrlHelper.getAllowedOrigins(configService);

// Generate verification link
const link = UrlHelper.generateVerificationLink(
  configService,
  'user@example.com',
  '123456',
  false // isAdmin
);

// Generate OAuth callback URL
const callbackUrl = UrlHelper.generateOAuthCallbackUrl(
  configService,
  accessToken,
  refreshToken,
  false // isAdmin
);
```

### 2. Automatic Environment Detection

The system automatically detects the environment:

**Development Mode:**
- `NODE_ENV=development` or `NODE_ENV=dev`
- Uses `http://localhost:5173` by default
- Allows multiple localhost ports for CORS

**Production Mode:**
- `NODE_ENV=production`
- Uses configured `CLIENT_URL` and `ADMIN_URL`
- Strict CORS policy

### 3. Role-Based URL Selection

When sending emails or redirecting users:

```typescript
// For applicants/nonprofits
const verificationLink = UrlHelper.generateVerificationLink(
  configService,
  email,
  code,
  false // Regular user → pairova.com
);

// For admins
const verificationLink = UrlHelper.generateVerificationLink(
  configService,
  email,
  code,
  true // Admin user → admin.pairova.com
);
```

### 4. Dynamic CORS Configuration

CORS origins are automatically configured based on environment:

**Development:**
```typescript
[
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:5173',
]
```

**Production:**
```typescript
[
  'https://pairova.com',
  'https://admin.pairova.com',
  // Any additional URLs from CLIENT_URL and ADMIN_URL
]
```

## Implementation Examples

### Email Verification

```typescript
// In auth.service.ts
const isAdmin = role === Role.ADMIN;
const verificationLink = UrlHelper.generateVerificationLink(
  this.configService,
  email,
  code,
  isAdmin,
);

await this.emailService.sendFromTemplate(
  user.email,
  'Verify Your Email',
  'email-verification',
  { code, name: displayName, verificationLink },
);
```

### OAuth Callbacks

```typescript
// In auth.controller.ts
const redirectUrl = UrlHelper.generateOAuthCallbackUrl(
  this.configService,
  user.accessToken,
  user.refreshToken,
  user.user?.role === 'admin',
);

res.redirect(redirectUrl);
```

### Password Reset

```typescript
const resetLink = `${UrlHelper.getFrontendUrlByRole(configService, user.role)}/reset-password?token=${resetToken}`;
```

## Benefits

### 1. **No Hardcoded URLs**
- All URLs are dynamically generated
- Easy to change environments
- No code changes needed for deployment

### 2. **Environment Flexibility**
- Works seamlessly in dev, staging, and production
- Automatic localhost detection
- No manual URL updates

### 3. **Multi-Domain Support**
- Single backend serves multiple frontends
- Role-based routing
- Separate admin and user apps

### 4. **Maintainability**
- Centralized URL logic
- Easy to update
- Consistent across the application

### 5. **Security**
- Automatic CORS configuration
- Environment-specific origins
- No unnecessary origins exposed

## Deployment Checklist

### Local Development

1. ✅ Set `NODE_ENV=development`
2. ✅ Set `CLIENT_URL=http://localhost:5173`
3. ✅ Set `ADMIN_URL=http://localhost:3001` (if using admin)
4. ✅ Restart backend server

### Production Deployment

1. ✅ Set `NODE_ENV=production`
2. ✅ Set `CLIENT_URL=https://pairova.com`
3. ✅ Set `ADMIN_URL=https://admin.pairova.com`
4. ✅ Update OAuth callback URLs in Google/LinkedIn consoles
5. ✅ Restart backend server
6. ✅ Test email verification links
7. ✅ Test OAuth login flows

## Troubleshooting

### Issue: Email links point to wrong URL

**Solution:**
1. Check `CLIENT_URL` in `.env`
2. Restart backend server
3. Test with new signup

### Issue: CORS errors in browser

**Solution:**
1. Check `NODE_ENV` is set correctly
2. Verify frontend URL is in allowed origins
3. Check browser console for exact origin being blocked
4. Add origin to `CLIENT_URL` or `ADMIN_URL`

### Issue: OAuth redirects to wrong domain

**Solution:**
1. Check OAuth callback URLs in provider console
2. Verify `CLIENT_URL` matches OAuth settings
3. Ensure backend is using latest `.env` values

## Testing

### Test Email Links

```bash
# 1. Sign up a new user
POST http://localhost:3007/auth/register
{
  "email": "test@example.com",
  "password": "Test123!",
  "role": "applicant"
}

# 2. Check email
# Link should be: http://localhost:5173/verify-email?email=...&code=...

# 3. Click link or visit manually
# Should redirect to verification page
```

### Test OAuth Flow

```bash
# 1. Visit OAuth endpoint
GET http://localhost:3007/auth/google

# 2. Complete Google login

# 3. Should redirect to:
# http://localhost:5173/auth/callback?accessToken=...&refreshToken=...
```

## Migration from Old System

If you're upgrading from hardcoded URLs:

1. **Update `.env` file:**
   ```env
   CLIENT_URL=http://localhost:5173  # Was hardcoded as 3001
   ```

2. **Restart backend:**
   ```bash
   npm run start:dev
   ```

3. **Test all email flows:**
   - Registration
   - Email verification
   - Password reset
   - OAuth callbacks

4. **No code changes needed!** ✅

## Advanced Configuration

### Custom URL Logic

You can extend `UrlHelper` for custom routing:

```typescript
// src/common/utils/url.helper.ts
static getCustomUrl(configService: ConfigService, userType: string): string {
  switch(userType) {
    case 'volunteer':
      return configService.get('VOLUNTEER_URL') || this.getFrontendUrl(configService);
    case 'donor':
      return configService.get('DONOR_URL') || this.getFrontendUrl(configService);
    default:
      return this.getFrontendUrl(configService);
  }
}
```

### Subdomain Support

```env
CLIENT_URL=https://app.pairova.com
ADMIN_URL=https://admin.pairova.com
VOLUNTEER_URL=https://volunteer.pairova.com
```

## Summary

✅ **Dynamic URL configuration** - No more hardcoded URLs
✅ **Environment-aware** - Automatically adapts to dev/prod
✅ **Multi-domain support** - Separate apps for users and admins
✅ **Role-based routing** - Users go to the right place
✅ **Automatic CORS** - Security configured automatically
✅ **Easy deployment** - Just update `.env` and restart

Your backend is now fully dynamic and production-ready! 🚀



