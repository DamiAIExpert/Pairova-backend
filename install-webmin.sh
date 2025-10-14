#!/bin/bash

# Webmin Installation Script for Ubuntu/Debian
# This script installs Webmin using the official installation method

echo "🔧 Installing Webmin on your DigitalOcean Droplet..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required dependencies
echo "📦 Installing dependencies..."
sudo apt install -y wget curl apt-transport-https software-properties-common

# Add Webmin repository
echo "📦 Adding Webmin repository..."
wget -qO - http://www.webmin.com/jcameron-key.asc | sudo apt-key add -
echo "deb http://download.webmin.com/download/repository sarge contrib" | sudo tee /etc/apt/sources.list.d/webmin.list

# Update package lists
echo "📦 Updating package lists..."
sudo apt update

# Install Webmin
echo "📦 Installing Webmin..."
sudo apt install -y webmin

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 10000

# Start and enable Webmin
echo "🚀 Starting Webmin service..."
sudo systemctl start webmin
sudo systemctl enable webmin

# Check Webmin status
echo "📊 Checking Webmin status..."
sudo systemctl status webmin --no-pager

echo "✅ Webmin installation completed!"
echo ""
echo "🌐 Access Webmin at: https://138.197.98.95:10000"
echo "👤 Username: root"
echo "🔑 Password: Your root password"
echo ""
echo "⚠️  Note: You may need to accept the SSL certificate warning in your browser"
echo "🔒 The connection is secure even with the warning"

