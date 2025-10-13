# Pairova Backend Deployment Guide

This guide will help you deploy your NestJS backend to DigitalOcean using your existing infrastructure.

## Prerequisites

- DigitalOcean Droplet: `nodejs-s-1vcpu-1gb-nyc3-01` (IP: 138.197.98.95)
- Load Balancer: `nyc3-load-balancer-01` (IP: 45.55.123.114)
- Domain: `server.pairova.com`
- SSH access to your Droplet

## Quick Deployment

### Option 1: Automated Deployment (Recommended)

1. **Make scripts executable:**
   ```bash
   chmod +x deploy.sh server-setup.sh
   ```

2. **Run server setup (first time only):**
   ```bash
   ./server-setup.sh
   ```

3. **Deploy your application:**
   ```bash
   ./deploy.sh
   ```

### Option 2: Manual Deployment

Follow the step-by-step guide below.

## Step-by-Step Manual Deployment

### Step 1: Connect to Your Droplet

```bash
ssh root@138.197.98.95
```

### Step 2: Set Up Server Environment

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PM2
sudo npm install pm2 -g

# Install Nginx
sudo apt install nginx -y

# Configure firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Step 3: Upload Your Code

From your local machine:

```bash
# Build the application
npm run build

# Upload files to server
scp -r dist package.json package-lock.json env.production.example root@138.197.98.95:/var/www/pairova-backend/
```

### Step 4: Set Up Application on Server

```bash
# Connect to server
ssh root@138.197.98.95

# Navigate to app directory
cd /var/www/pairova-backend

# Install dependencies
npm ci --only=production

# Create environment file
cp env.production.example .env
nano .env  # Edit with your production values
```

### Step 5: Configure Environment Variables

Edit the `.env` file with your production values:

```env
NODE_ENV=production
PORT=3000
CLIENT_URL=https://your-frontend-domain.com

# Database
DATABASE_URL=postgresql://username:password@host:port/database_name

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email (if using)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Twilio (if using)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Cloudinary (if using)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Step 6: Start Application with PM2

```bash
# Start the application
pm2 start dist/main.js --name "nestjs-api"

# Save PM2 configuration
pm2 save

# Set up auto-startup
pm2 startup
# Follow the instructions provided by PM2
```

### Step 7: Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/server.pairova.com
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name server.pairova.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Handle WebSocket connections
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/server.pairova.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: Connect Droplet to Load Balancer

1. Go to your DigitalOcean dashboard
2. Navigate to your Load Balancer: `nyc3-load-balancer-01`
3. Go to the "Droplets" tab
4. Add your Droplet: `nodejs-s-1vcpu-1gb-nyc3-01`

### Step 9: Configure DNS

1. Go to your domain registrar
2. Create an A record:
   - **Host/Name:** `server`
   - **Value/Points to:** `45.55.123.114` (Load Balancer IP)
   - **TTL:** 300 seconds

### Step 10: Set Up SSL (Recommended)

1. Go to your Load Balancer settings in DigitalOcean
2. Navigate to "Settings" → "SSL Certificate"
3. Select "Let's Encrypt"
4. Choose your domain: `server.pairova.com`
5. Generate and save the certificate

## Monitoring and Maintenance

### Check Application Status

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs nestjs-api

# Restart application
pm2 restart nestjs-api
```

### Check Nginx Status

```bash
# Check Nginx status
sudo systemctl status nginx

# Test Nginx configuration
sudo nginx -t

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Update Application

```bash
# Pull latest changes
git pull origin main

# Build application
npm run build

# Restart with PM2
pm2 restart nestjs-api
```

## Troubleshooting

### Application Not Starting

1. Check PM2 logs: `pm2 logs nestjs-api`
2. Verify environment variables: `cat .env`
3. Check if port 3000 is available: `netstat -tlnp | grep 3000`

### Nginx Issues

1. Test configuration: `sudo nginx -t`
2. Check error logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify site is enabled: `ls -la /etc/nginx/sites-enabled/`

### Database Connection Issues

1. Verify database credentials in `.env`
2. Check if database server is accessible
3. Ensure firewall allows database connections

## Security Considerations

- Keep your `.env` file secure and never commit it to version control
- Use strong passwords and secrets
- Regularly update system packages
- Monitor application logs for suspicious activity
- Use SSL/HTTPS in production
- Configure proper CORS settings

## Support

If you encounter any issues during deployment, check the logs and verify all configuration steps. The application should be accessible at `https://server.pairova.com` once all steps are completed.
