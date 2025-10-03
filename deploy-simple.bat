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
echo docker-compose -f docker-compose.simple.yml up -d

echo.
echo Done! Your app will be at http://YOUR_EC2_IP

