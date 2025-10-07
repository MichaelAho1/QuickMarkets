#!/bin/bash

# Timer Service Startup Script
# This script sets up and runs the timer service on a separate EC2 instance

echo "🚀 Starting QuickMarkets Timer Service..."

# Update system
sudo yum update -y

# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create project directory
mkdir -p ~/quickmarkets-timer
cd ~/quickmarkets-timer

# Clone the repository (or copy files)
# Option 1: If you have the repo on GitHub
# git clone https://github.com/yourusername/QuickMarkets-2.git .

# Option 2: If you want to copy files from your main instance
# scp -r ec2-user@your-main-instance-ip:~/QuickMarkets-2/* .

echo "📁 Project directory created. Please copy your project files here."

# Create .env file
cat > .env << EOF
SECRET_KEY=${SECRET_KEY}
DEBUG=False
ALLOWED_HOSTS=*
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
EOF

echo "⚙️  Environment file created. Please update with your actual values."

# Start the timer service
echo "🔄 Starting timer service..."
docker-compose -f docker-compose.timer.yml up -d

echo "✅ Timer service is now running!"
echo "📊 Check status with: docker-compose -f docker-compose.timer.yml ps"
echo "📋 View logs with: docker-compose -f docker-compose.timer.yml logs -f"
echo "🛑 Stop with: docker-compose -f docker-compose.timer.yml down"
