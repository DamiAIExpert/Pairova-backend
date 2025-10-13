#!/bin/bash

# Server Setup Script for DigitalOcean Droplet
# This script sets up the server environment for NestJS deployment

set -e  # Exit on any error

echo "🔧 Setting up DigitalOcean Droplet for NestJS deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

print_status "Installing essential packages..."
sudo apt install -y curl wget git unzip software-properties-common

print_status "Installing Node.js (if not already installed)..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    print_warning "Node.js is already installed: $(node --version)"
fi

print_status "Installing PM2 globally..."
sudo npm install pm2 -g

print_status "Installing Nginx..."
sudo apt install nginx -y

print_status "Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

print_status "Creating application directory..."
sudo mkdir -p /var/www/pairova-backend
sudo chown -R $USER:$USER /var/www/pairova-backend

print_status "Setting up PM2 startup script..."
pm2 startup
print_warning "Please run the command that PM2 provides above to enable auto-startup"

print_status "Creating Nginx configuration for pairova-backend..."
sudo tee /etc/nginx/sites-available/server.pairova.com > /dev/null <<EOF
server {
    listen 80;
    server_name server.pairova.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Handle WebSocket connections
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

print_status "Enabling the Nginx site..."
sudo ln -sf /etc/nginx/sites-available/server.pairova.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

print_status "Testing Nginx configuration..."
sudo nginx -t

print_status "Starting and enabling Nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

print_status "Setting up log rotation for PM2..."
sudo tee /etc/logrotate.d/pm2 > /dev/null <<EOF
/home/*/.pm2/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

print_status "Creating systemd service for PM2 (backup method)..."
sudo tee /etc/systemd/system/pm2-pairova.service > /dev/null <<EOF
[Unit]
Description=PM2 process manager for Pairova Backend
Documentation=https://pm2.keymetrics.io/
After=network.target

[Service]
Type=notify
User=root
LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity
Environment=PATH=/usr/bin:/usr/local/bin
Environment=PM2_HOME=/root/.pm2
ExecStart=/usr/bin/pm2-runtime start /var/www/pairova-backend/dist/main.js --name nestjs-api
ExecReload=/usr/bin/pm2 reload all
ExecStop=/usr/bin/pm2 kill

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload

print_status "✅ Server setup completed successfully!"
print_warning "Next steps:"
print_warning "1. Run the deployment script to upload your application"
print_warning "2. Update the .env file with your production values"
print_warning "3. Connect your Droplet to the Load Balancer in DigitalOcean dashboard"
print_warning "4. Update DNS records to point to the Load Balancer IP: 45.55.123.114"
print_warning "5. Set up SSL certificate on the Load Balancer"

print_status "Server is ready for deployment! 🚀"
