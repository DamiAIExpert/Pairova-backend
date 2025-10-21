# Quick Deploy Guide

## Updated Files
The following files have been updated to improve the API integration:

1. **src/auth/auth.service.ts** - Updated login() and register() to return:
   - `accessToken`
   - `refreshToken`
   - `user` object (without password)

2. **src/main.ts** - Updated CORS configuration to allow:
   - http://localhost:5173 (Vite dev server)
   - http://localhost:3001 (Next.js dev server)
   - https://pairova.com
   - https://www.pairova.com
   - https://admin.pairova.com

## Deploy to Production

### Option 1: Using the Deploy Script (Recommended)

```powershell
# From pairova-backend directory
.\deploy-windows.ps1
```

### Option 2: Manual Deployment

```powershell
# 1. Build the project
npm run build

# 2. Copy files to your server
# (Replace with your actual server details)
scp -r dist package.json package-lock.json root@api.pairova.com:/var/www/pairova-backend/

# 3. SSH to server and restart
ssh root@api.pairova.com
cd /var/www/pairova-backend
npm ci --only=production
pm2 restart nestjs-api
pm2 save
```

### Option 3: If using Git on server

```bash
# SSH to server
ssh root@api.pairova.com

# Navigate to project directory
cd /var/www/pairova-backend

# Pull latest changes
git pull origin main

# Install dependencies and build
npm install
npm run build

# Restart PM2
pm2 restart nestjs-api
pm2 save
```

## Verify Deployment

After deployment, test the API:

```powershell
# Test login endpoint
Invoke-WebRequest -Uri "https://api.pairova.com/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"test"}' `
  | Select-Object StatusCode, Content
```

## Frontend Configuration

The frontend `.env` file has been created with:
```
VITE_API_URL=https://api.pairova.com
```

## Next Steps

1. ✅ Backend updated and ready for deployment
2. ⏳ Deploy backend to production (follow one of the options above)
3. ⏳ Test frontend integration with deployed backend
4. ⏳ Update admin dashboard if needed

## Troubleshooting

If you encounter CORS errors:
- Verify the CORS origins in `src/main.ts` match your frontend domains
- Check that the backend is running on HTTPS
- Ensure the Load Balancer/Nginx is configured correctly

If authentication fails:
- Check the JWT_SECRET is set in production `.env`
- Verify the database connection is working
- Check PM2 logs: `pm2 logs nestjs-api`

