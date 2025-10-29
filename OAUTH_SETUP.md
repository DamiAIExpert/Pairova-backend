# OAuth Authentication Setup Guide

This guide will help you set up Google and LinkedIn OAuth authentication for the Pairova application.

## Table of Contents
1. [Google OAuth Setup](#google-oauth-setup)
2. [LinkedIn OAuth Setup](#linkedin-oauth-setup)
3. [Environment Variables](#environment-variables)
4. [Testing OAuth Flow](#testing-oauth-flow)

---

## Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `Pairova` (or your preferred name)
4. Click "Create"

### Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: **External**
   - App name: `Pairova`
   - User support email: Your email
   - Developer contact email: Your email
   - Add scopes: `email`, `profile`
   - Add test users (your email addresses)
   - Click "Save and Continue"

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `Pairova Web Client`
   - Authorized JavaScript origins:
     - `http://localhost:5173` (frontend dev)
     - `http://localhost:3007` (backend dev)
     - `https://your-production-domain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:3007/auth/google/callback` (dev)
     - `https://your-backend-domain.com/auth/google/callback` (production)
   - Click "Create"

5. **Copy the Client ID and Client Secret** - you'll need these for your `.env` file

---

## LinkedIn OAuth Setup

### Step 1: Create a LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Click "Create app"
3. Fill in the form:
   - App name: `Pairova`
   - LinkedIn Page: Select your company page (or create one)
   - App logo: Upload your logo
   - Legal agreement: Check the box
   - Click "Create app"

### Step 2: Configure OAuth Settings

1. Go to the "Auth" tab
2. Under "OAuth 2.0 settings":
   - Add Redirect URLs:
     - `http://localhost:3007/auth/linkedin/callback` (dev)
     - `https://your-backend-domain.com/auth/linkedin/callback` (production)
   - Click "Update"

### Step 3: Request API Access

1. Go to the "Products" tab
2. Request access to:
   - **Sign In with LinkedIn** (required)
   - Click "Request access" and wait for approval (usually instant)

### Step 4: Get Credentials

1. Go back to the "Auth" tab
2. **Copy the Client ID and Client Secret** - you'll need these for your `.env` file

---

## Environment Variables

### Backend (.env)

Add these variables to your `pairova-backend/.env` file:

```env
# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:3007/auth/google/callback

# OAuth - LinkedIn
LINKEDIN_CLIENT_ID=your-linkedin-client-id-here
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret-here
LINKEDIN_CALLBACK_URL=http://localhost:3007/auth/linkedin/callback

# Frontend URL (for OAuth redirects)
CLIENT_URL=http://localhost:5173

# Existing variables (make sure these are set)
PORT=3007
JWT_SECRET=your-jwt-secret-here
DATABASE_URL=postgresql://username:password@localhost:5432/pairova
```

### Frontend (.env)

Make sure your `pairova-frontend/.env` file has:

```env
VITE_API_URL=http://localhost:3007
```

---

## Testing OAuth Flow

### 1. Start the Backend

```bash
cd pairova-backend
npm run start:dev
```

### 2. Start the Frontend

```bash
cd pairova-frontend
npm run dev
```

### 3. Test Google OAuth

1. Go to `http://localhost:5173/signup`
2. Select your role (Job Seeker or Non-Profit)
3. Click "Sign up with Google"
4. You should be redirected to Google's login page
5. Sign in with your Google account
6. Grant permissions
7. You should be redirected back to the app with your account created

### 4. Test LinkedIn OAuth

1. Go to `http://localhost:5173/signup`
2. Select your role (Job Seeker or Non-Profit)
3. Click "Sign up with LinkedIn"
4. You should be redirected to LinkedIn's login page
5. Sign in with your LinkedIn account
6. Grant permissions
7. You should be redirected back to the app with your account created

---

## OAuth Flow Diagram

```
User clicks "Sign up with Google/LinkedIn"
    ↓
Frontend redirects to: http://localhost:3007/auth/google (or /auth/linkedin)
    ↓
Backend redirects to: Google/LinkedIn OAuth consent screen
    ↓
User grants permissions
    ↓
OAuth provider redirects to: http://localhost:3007/auth/google/callback (with auth code)
    ↓
Backend exchanges code for user profile
    ↓
Backend creates/finds user in database
    ↓
Backend generates JWT tokens
    ↓
Backend redirects to: http://localhost:5173/auth/callback?accessToken=...&refreshToken=...
    ↓
Frontend stores tokens and fetches user data
    ↓
Frontend redirects to appropriate page (onboarding or dashboard)
```

---

## Troubleshooting

### "redirect_uri_mismatch" Error

- **Cause**: The redirect URI in your OAuth provider settings doesn't match the one in your code
- **Solution**: Make sure the redirect URIs in Google Cloud Console / LinkedIn Developer Portal exactly match:
  - `http://localhost:3007/auth/google/callback`
  - `http://localhost:3007/auth/linkedin/callback`

### "invalid_client" Error

- **Cause**: Client ID or Client Secret is incorrect
- **Solution**: Double-check your `.env` file and make sure you copied the credentials correctly

### User is created but not redirected

- **Cause**: `CLIENT_URL` environment variable is not set or incorrect
- **Solution**: Set `CLIENT_URL=http://localhost:5173` in your backend `.env` file

### OAuth works but user data is missing

- **Cause**: Profile creation failed
- **Solution**: Check backend logs for errors. Make sure the database migrations have been run:
  ```bash
  cd pairova-backend
  npm run db:migration:run
  ```

---

## Production Deployment

### 1. Update OAuth Provider Settings

**Google Cloud Console:**
- Add production redirect URI: `https://api.your-domain.com/auth/google/callback`
- Add production JavaScript origin: `https://your-domain.com`

**LinkedIn Developer Portal:**
- Add production redirect URI: `https://api.your-domain.com/auth/linkedin/callback`

### 2. Update Environment Variables

**Backend Production `.env`:**
```env
GOOGLE_CALLBACK_URL=https://api.your-domain.com/auth/google/callback
LINKEDIN_CALLBACK_URL=https://api.your-domain.com/auth/linkedin/callback
CLIENT_URL=https://your-domain.com
```

**Frontend Production `.env`:**
```env
VITE_API_URL=https://api.your-domain.com
```

---

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different OAuth credentials** for development and production
3. **Enable HTTPS** in production (OAuth providers require it)
4. **Regularly rotate** your Client Secrets
5. **Monitor OAuth usage** in Google Cloud Console / LinkedIn Developer Portal
6. **Set up proper CORS** in production
7. **Implement rate limiting** on OAuth endpoints

---

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [LinkedIn OAuth 2.0 Documentation](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication)
- [Passport.js Documentation](http://www.passportjs.org/)

---

## Support

If you encounter any issues, please:
1. Check the backend logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure database migrations have been run
4. Test with a fresh browser session (clear cookies/cache)

For further assistance, contact the development team.



