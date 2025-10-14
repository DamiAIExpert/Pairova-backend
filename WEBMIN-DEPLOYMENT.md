# Webmin Deployment Guide for Pairova Backend

This guide will help you deploy your NestJS backend using Webmin for easier server management.

## Step 1: Install Webmin on Your Droplet

Run these commands in your SSH session:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Webmin
wget http://prdownloads.sourceforge.net/webadmin/webmin_2.021_all.deb
sudo dpkg -i webmin_2.021_all.deb
sudo apt-get install -f

# Or install the latest version
wget https://download.webmin.com/deb/webmin-current.deb
sudo dpkg -i webmin-current.deb
sudo apt-get install -f

# Allow Webmin through firewall
sudo ufw allow 10000
```

## Step 2: Access Webmin

1. Open your web browser
2. Go to: `https://138.197.98.95:10000`
3. Login with:
   - **Username:** `root`
   - **Password:** Your root password

## Step 3: Install Required Software via Webmin

### Install Node.js and PM2

1. In Webmin, go to **System** → **Software Packages**
2. Search for and install:
   - `nodejs`
   - `npm`
   - `git`
   - `nginx`

### Install PM2 via Terminal

1. In Webmin, go to **System** → **Command Shell**
2. Run: `sudo npm install pm2 -g`

## Step 4: Upload Your Application Files

### Method 1: Using Webmin File Manager

1. In Webmin, go to **Tools** → **File Manager**
2. Navigate to `/var/www/`
3. Create a new directory called `pairova-backend`
4. Upload your files:
   - `dist/` folder (compiled JavaScript)
   - `package.json`
   - `package-lock.json`
   - `env.production.example`

### Method 2: Using SCP from Windows

From your Windows machine:

```powershell
# Navigate to your project directory
cd C:\Users\damit\OneDrive\Desktop\pairova-backend

# Build the application
npm run build

# Upload files
scp -r dist package.json package-lock.json env.production.example root@138.197.98.95:/var/www/pairova-backend/
```

## Step 5: Configure Environment Variables

1. In Webmin File Manager, navigate to `/var/www/pairova-backend/`
2. Copy `env.production.example` to `.env`
3. Edit the `.env` file with your production values:

```env
NODE_ENV=production
PORT=3000
CLIENT_URL=https://your-frontend-domain.com

# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email Configuration (if using)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Twilio Configuration (if using)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Cloudinary Configuration (if using)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

## Step 6: Install Dependencies and Start Application

1. In Webmin, go to **System** → **Command Shell**
2. Run these commands:

```bash
cd /var/www/pairova-backend
npm ci --only=production
pm2 start dist/main.js --name "nestjs-api"
pm2 save
pm2 startup
```

## Step 7: Configure Nginx via Webmin

1. In Webmin, go to **Servers** → **Nginx Web Server**
2. Click **Create virtual server**
3. Configure:
   - **Server name:** `server.pairova.com`
   - **Document root:** `/var/www/pairova-backend`
   - **Port:** `80`

4. In the **Location** section, add:

```nginx
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
```

5. Save and apply the configuration

## Step 8: Configure Firewall via Webmin

1. In Webmin, go to **Networking** → **Linux Firewall**
2. Add rules for:
   - **Port 80** (HTTP)
   - **Port 443** (HTTPS)
   - **Port 10000** (Webmin)

## Step 9: Monitor Your Application

### Using Webmin System Monitor

1. Go to **System** → **System Information**
2. Monitor CPU, Memory, and Disk usage

### Using PM2 via Webmin Terminal

1. Go to **System** → **Command Shell**
2. Run: `pm2 status` to check application status
3. Run: `pm2 logs nestjs-api` to view logs

## Step 10: Connect to Load Balancer

1. Go to your DigitalOcean dashboard
2. Navigate to your Load Balancer: `nyc3-load-balancer-01`
3. Go to the "Droplets" tab
4. Add your Droplet: `nodejs-s-1vcpu-1gb-nyc3-01`

## Step 11: Configure DNS

1. Go to your domain registrar
2. Create an A record:
   - **Host/Name:** `server`
   - **Value/Points to:** `45.55.123.114` (Load Balancer IP)
   - **TTL:** 300 seconds

## Step 12: Set Up SSL

1. Go to your Load Balancer settings in DigitalOcean
2. Navigate to "Settings" → "SSL Certificate"
3. Select "Let's Encrypt"
4. Choose your domain: `server.pairova.com`
5. Generate and save the certificate

## Webmin Benefits for Your Deployment

### File Management
- Easy file uploads and downloads
- Visual file browser
- Built-in text editor
- File permissions management

### System Monitoring
- Real-time system statistics
- Process monitoring
- Log file viewing
- Service management

### Service Management
- Start/stop/restart services
- Service configuration
- Automatic startup configuration

### Security
- Firewall management
- User account management
- SSL certificate management

## Troubleshooting via Webmin

### Check Application Logs
1. Go to **System** → **System Logs**
2. Or use **System** → **Command Shell**: `pm2 logs nestjs-api`

### Check Nginx Status
1. Go to **Servers** → **Nginx Web Server**
2. Check server status and configuration

### Monitor System Resources
1. Go to **System** → **System Information**
2. Monitor CPU, memory, and disk usage

## Next Steps

Once everything is configured:
1. Your application will be accessible at `https://server.pairova.com`
2. Use Webmin to monitor and manage your server
3. Set up automated backups via Webmin
4. Configure log rotation and monitoring

The Webmin interface makes server management much more intuitive! 🎉

