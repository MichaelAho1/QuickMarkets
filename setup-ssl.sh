#!/bin/bash

# SSL Certificate Setup Script for QuickMarkets Production
# This script helps set up SSL certificates for production deployment

echo "🔒 SSL Certificate Setup for QuickMarkets"
echo "========================================"

# Check if running on AWS EC2
if [ -f /sys/hypervisor/uuid ] && [ `head -c 3 /sys/hypervisor/uuid` == ec2 ]; then
    echo "✅ Running on AWS EC2 - Perfect for production!"
else
    echo "⚠️  Not running on AWS EC2. This script is designed for AWS deployment."
fi

echo ""
echo "Choose your SSL certificate option:"
echo "1) Let's Encrypt (Free, recommended for production)"
echo "2) Self-signed certificate (Development only)"
echo "3) Use existing certificates"

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🔧 Setting up Let's Encrypt SSL certificates..."
        
        # Install certbot
        sudo apt update
        sudo apt install -y certbot python3-certbot-nginx
        
        # Stop nginx temporarily
        sudo systemctl stop nginx
        
        # Get certificate
        echo "Getting SSL certificate for quickmarketz.com..."
        sudo certbot certonly --standalone -d quickmarketz.com -d www.quickmarketz.com
        
        # Update nginx config to use Let's Encrypt certificates
        sudo sed -i 's|/etc/nginx/ssl/cert.pem|/etc/letsencrypt/live/quickmarketz.com/fullchain.pem|g' /etc/nginx/nginx.conf
        sudo sed -i 's|/etc/nginx/ssl/key.pem|/etc/letsencrypt/live/quickmarketz.com/privkey.pem|g' /etc/nginx/nginx.conf
        
        # Set up auto-renewal
        echo "Setting up automatic certificate renewal..."
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
        
        echo "✅ Let's Encrypt SSL setup complete!"
        ;;
        
    2)
        echo "🔧 Creating self-signed certificate..."
        sudo mkdir -p /etc/nginx/ssl
        sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout /etc/nginx/ssl/key.pem \
            -out /etc/nginx/ssl/cert.pem \
            -subj "/C=US/ST=State/L=City/O=QuickMarkets/CN=quickmarketz.com"
        
        echo "⚠️  Self-signed certificate created. Browsers will show security warnings."
        ;;
        
    3)
        echo "📁 Using existing certificates..."
        echo "Please ensure your certificates are placed in:"
        echo "  Certificate: /etc/nginx/ssl/cert.pem"
        echo "  Private Key: /etc/nginx/ssl/key.pem"
        ;;
        
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "🚀 Next steps:"
echo "1. Update your DNS to point quickmarketz.com to this server's IP"
echo "2. Run: docker-compose -f docker-compose.simple.yml up -d"
echo "3. Test your site at: https://quickmarketz.com"
echo ""
echo "✅ SSL setup complete!"
