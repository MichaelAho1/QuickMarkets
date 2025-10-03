@echo off
echo Simple QuickMarkets Deployment

echo Step 1: Create RDS Database
echo Run this command in AWS CLI:
echo aws rds create-db-instance --db-instance-identifier quickmarkets-db --db-instance-class db.t3.micro --engine postgres --master-username postgres --master-user-password YourPassword123 --allocated-storage 20 --publicly-accessible

echo.
echo Step 2: Wait 5-10 minutes for database to be ready
echo.

echo Step 3: Get database endpoint
echo aws rds describe-db-instances --db-instance-identifier quickmarkets-db --query "DBInstances[0].Endpoint.Address" --output text

echo.
echo Step 4: Update your .env files with the database endpoint
echo.

echo Step 5: Launch EC2 instance (Ubuntu 22.04, t3.micro)
echo Security groups: HTTP(80), HTTPS(443), SSH(22), Custom TCP(8000)

echo.
echo Step 6: SSH into EC2 and run:
echo sudo apt update
echo sudo apt install docker.io docker-compose -y
echo sudo usermod -aG docker ubuntu
echo git clone YOUR_REPO
echo cd YOUR_REPO

echo.
echo Step 7: Set up SSL certificates (choose one):
echo Option A - Let's Encrypt (Free, recommended):
echo sudo apt install certbot python3-certbot-nginx
echo sudo certbot certonly --standalone -d quickmarketz.com -d www.quickmarketz.com
echo.
echo Option B - Self-signed (Development only):
echo sudo mkdir -p /etc/nginx/ssl
echo sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/key.pem -out /etc/nginx/ssl/cert.pem -subj "/C=US/ST=State/L=City/O=QuickMarkets/CN=quickmarketz.com"

echo.
echo Step 8: Deploy the application:
echo docker-compose -f docker-compose.simple.yml up -d

echo.
echo Done! Your app will be at https://quickmarketz.com
echo (HTTP requests will automatically redirect to HTTPS)

