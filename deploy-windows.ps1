# PowerShell Deployment Script for Pairova Backend
# This script automates the deployment process from Windows to DigitalOcean Droplet

param(
    [string]$DropletIP = "138.197.98.95",
    [string]$DropletUser = "root",
    [string]$AppName = "pairova-backend"
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"

function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

Write-Status "🚀 Starting Pairova Backend Deployment from Windows..."

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Error "package.json not found. Please run this script from the project root directory."
    exit 1
}

# Check if dist folder exists
if (-not (Test-Path "dist")) {
    Write-Warning "dist folder not found. Building the application..."
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build failed. Please check your code and try again."
        exit 1
    }
}

Write-Status "Building application for production..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed. Please check your code and try again."
    exit 1
}

Write-Status "Creating deployment package..."
# Create a temporary directory for deployment
$TempDir = New-TemporaryFile | ForEach-Object { Remove-Item $_; New-Item -ItemType Directory -Path $_ }

# Copy files to temp directory
Copy-Item -Path "dist" -Destination $TempDir -Recurse
Copy-Item -Path "package.json" -Destination $TempDir
Copy-Item -Path "package-lock.json" -Destination $TempDir
Copy-Item -Path "env.production.example" -Destination $TempDir

Write-Status "Uploading files to server..."
# Upload files to the server
scp -r "$TempDir\*" "${DropletUser}@${DropletIP}:/tmp/$AppName/"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to upload files to server. Please check your SSH connection."
    exit 1
}

Write-Status "Running deployment commands on server..."
# Execute deployment commands on the server
$DeployScript = @"
set -e

echo "📦 Setting up application directory..."
sudo mkdir -p /var/www/$AppName
sudo chown -R `$USER:`$USER /var/www/$AppName

echo "📁 Copying application files..."
cp -r /tmp/$AppName/* /var/www/$AppName/
cd /var/www/$AppName

echo "📦 Installing dependencies..."
npm ci --only=production

echo "🔧 Setting up environment..."
if [ ! -f .env ]; then
    cp env.production.example .env
    echo "⚠️  Please edit .env file with your production values!"
fi

echo "🔄 Restarting application with PM2..."
pm2 delete nestjs-api 2>/dev/null || true
pm2 start dist/main.js --name "nestjs-api"
pm2 save

echo "🧹 Cleaning up temporary files..."
rm -rf /tmp/$AppName

echo "✅ Deployment completed successfully!"
echo "📊 Application status:"
pm2 status
"@

# Execute the deployment script on the server
ssh "${DropletUser}@${DropletIP}" $DeployScript

if ($LASTEXITCODE -ne 0) {
    Write-Error "Deployment failed on server. Please check the server logs."
    exit 1
}

# Clean up local temporary directory
Remove-Item -Path $TempDir -Recurse -Force

Write-Status "Deployment completed! 🎉"
Write-Warning "Don't forget to:"
Write-Warning "1. Update the .env file on the server with your production values"
Write-Warning "2. Configure Nginx reverse proxy (see DEPLOYMENT-WINDOWS.md)"
Write-Warning "3. Connect the Droplet to your Load Balancer"
Write-Warning "4. Update DNS records to point to the Load Balancer"
Write-Warning "5. Set up SSL certificate on the Load Balancer"

Write-Status "Next steps:"
Write-Status "1. SSH to your server: ssh $DropletUser@$DropletIP"
Write-Status "2. Edit environment file: nano /var/www/$AppName/.env"
Write-Status "3. Configure Nginx: sudo nano /etc/nginx/sites-available/server.pairova.com"
Write-Status "4. Follow the complete guide in DEPLOYMENT-WINDOWS.md"

