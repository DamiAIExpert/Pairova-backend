#!/bin/bash

# Pairova Backend Deployment Script
# This script automates the deployment process to DigitalOcean Droplet

set -e  # Exit on any error

echo "🚀 Starting Pairova Backend Deployment..."

# Configuration
DROPLET_IP="138.197.98.95"
DROPLET_USER="root"
APP_NAME="pairova-backend"
APP_DIR="/var/www/$APP_NAME"
SERVICE_NAME="nestjs-api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check if dist folder exists
if [ ! -d "dist" ]; then
    print_warning "dist folder not found. Building the application..."
    npm run build
fi

print_status "Building application for production..."
npm run build

print_status "Creating deployment package..."
# Create a temporary directory for deployment
TEMP_DIR=$(mktemp -d)
cp -r dist package.json package-lock.json env.production.example $TEMP_DIR/

print_status "Uploading files to server..."
# Upload files to the server
scp -r $TEMP_DIR/* $DROPLET_USER@$DROPLET_IP:/tmp/$APP_NAME/

print_status "Running deployment commands on server..."
# Execute deployment commands on the server
ssh $DROPLET_USER@$DROPLET_IP << EOF
    set -e
    
    echo "📦 Setting up application directory..."
    sudo mkdir -p $APP_DIR
    sudo chown -R \$USER:\$USER $APP_DIR
    
    echo "📁 Copying application files..."
    cp -r /tmp/$APP_NAME/* $APP_DIR/
    cd $APP_DIR
    
    echo "📦 Installing dependencies..."
    npm ci --only=production
    
    echo "🔧 Setting up environment..."
    if [ ! -f .env ]; then
        cp env.production.example .env
        echo "⚠️  Please edit .env file with your production values!"
    fi
    
    echo "🔄 Restarting application with PM2..."
    pm2 delete $SERVICE_NAME 2>/dev/null || true
    pm2 start dist/main.js --name "$SERVICE_NAME"
    pm2 save
    
    echo "🧹 Cleaning up temporary files..."
    rm -rf /tmp/$APP_NAME
    
    echo "✅ Deployment completed successfully!"
    echo "📊 Application status:"
    pm2 status
EOF

# Clean up local temporary directory
rm -rf $TEMP_DIR

print_status "Deployment completed! 🎉"
print_warning "Don't forget to:"
print_warning "1. Update the .env file on the server with your production values"
print_warning "2. Configure Nginx reverse proxy"
print_warning "3. Connect the Droplet to your Load Balancer"
print_warning "4. Update DNS records to point to the Load Balancer"
