# Windows Deployment Guide for Pairova Backend

This guide is specifically tailored for Windows users deploying to DigitalOcean.

## Prerequisites

- Windows PowerShell or Command Prompt
- SSH client (Windows 10+ has built-in SSH)
- Your DigitalOcean Droplet credentials

## Step 1: Connect to Your Droplet

Open PowerShell or Command Prompt and connect to your server:

```powershell
ssh root@138.197.98.95
```

## Step 2: Set Up Server Environment

Once connected to your Droplet, run these commands:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip software-properties-common

# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install pm2 -g

# Install Nginx
sudo apt install nginx -y

# Configure firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Create application directory
sudo mkdir -p /var/www/pairova-backend
sudo chown -R $USER:$USER /var/www/pairova-backend
```

## Step 3: Upload Your Code

From your Windows machine, open a new PowerShell window and navigate to your project directory:

```powershell
# Navigate to your project directory
cd C:\Users\damit\OneDrive\Desktop\pairova-backend

# Build the application
npm run build

# Upload files to server (replace with your actual path)
scp -r dist package.json package-lock.json env.production.example root@138.197.98.95:/var/www/pairova-backend/
```

## Step 4: Set Up Application on Server

Back in your SSH session to the server:

```bash
# Navigate to app directory
cd /var/www/pairova-backend

# Install dependencies
npm ci --only=production

# Create environment file
cp env.production.example .env
nano .env  # Edit with your production values
```

## Step 5: Configure Environment Variables

Edit the `.env` file with your production values. Here's what you need to update:

```env
NODE_ENV=production
PORT=3000
CLIENT_URL=https://your-frontend-domain.com

# Database - Choose one option:
# Option 1: Use DATABASE_URL (recommended)
DATABASE_URL=postgresql://username:password@host:port/database_name

# Option 2: Use discrete credentials
# DB_HOST=your-db-host
# DB_PORT=5432
# DB_USERNAME=your-db-username
# DB_PASSWORD=your-db-password
# DB_DATABASE=your-db-name

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

## Step 6: Start Application with PM2

```bash
# Start the application
pm2 start dist/main.js --name "nestjs-api"

# Save PM2 configuration
pm2 save

# Set up auto-startup
pm2 startup
# Follow the instructions provided by PM2
```

## Step 7: Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/server.pairova.com
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name server.pairova.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

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
        proxy_read_timeout 86400;
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

## Step 8: Connect Droplet to Load Balancer

1. Go to your DigitalOcean dashboard
2. Navigate to your Load Balancer: `nyc3-load-balancer-01`
3. Go to the "Droplets" tab
4. Add your Droplet: `nodejs-s-1vcpu-1gb-nyc3-01`

## Step 9: Configure DNS

1. Go to your domain registrar
2. Create an A record:
   - **Host/Name:** `server`
   - **Value/Points to:** `45.55.123.114` (Load Balancer IP)
   - **TTL:** 300 seconds

## Step 10: Set Up SSL (Recommended)

1. Go to your Load Balancer settings in DigitalOcean
2. Navigate to "Settings" → "SSL Certificate"
3. Select "Let's Encrypt"
4. Choose your domain: `server.pairova.com`
5. Generate and save the certificate

## Verification

Check if everything is working:

```bash
# Check PM2 status
pm2 status

# Check Nginx status
sudo systemctl status nginx

# View application logs
pm2 logs nestjs-api

# Test the application
curl http://localhost:3000
```

## Troubleshooting

### If the application doesn't start:
```bash
pm2 logs nestjs-api
```

### If Nginx has issues:
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### If you need to restart services:
```bash
pm2 restart nestjs-api
sudo systemctl restart nginx
```

## Next Steps

Once deployed, your application should be accessible at:
- `https://server.pairova.com` (after DNS propagation and SSL setup)

The deployment is complete! 🎉

