# QuickMarkets Timer Service Setup

This guide shows you how to set up a separate AWS EC2 instance to run the stock simulation timer service.

## 🎯 What This Does

The timer service runs `start_timer.py` which:
- Calls EndOfDayGenerator every 15 seconds
- Calls duringDayGenerator every 5 seconds
- Manages simulation timer state in your PostgreSQL database
- Runs independently from your main application

## 🚀 AWS Setup

### 1. Launch New EC2 Instance

1. **Go to EC2 Console** → Launch Instance
2. **Choose AMI**: Amazon Linux 2 (free tier eligible)
3. **Instance Type**: t2.micro (free tier) or t3.small
4. **Key Pair**: Use your existing `BackendKeyPair.pem`
5. **Security Group**: Create new or use existing
   - **Inbound Rules**:
     - SSH (22) from your IP
     - HTTP (80) from anywhere (optional, for monitoring)
6. **Storage**: 8GB should be enough
7. **Launch Instance**

### 2. Connect to Your Timer Instance

```bash
ssh -i "BackendKeyPair.pem" ec2-user@YOUR_TIMER_INSTANCE_IP
```

### 3. Copy Project Files

**Option A: From GitHub (Recommended)**
```bash
# On the timer instance
git clone https://github.com/MichaelAho1/QuickMarkets.git
cd QuickMarkets
```

**Option B: Copy from Main Instance**
```bash
# From your local machine
scp -r -i "BackendKeyPair.pem" ./QuickMarkets ec2-user@YOUR_TIMER_IP:~/
```

### 4. Set Up Environment

```bash
# Make scripts executable
chmod +x timer-start.sh
chmod +x timer-control.sh

# Create .env file with your database credentials
nano .env
```

**Add to .env:**
```env
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=*
DB_NAME=postgres
DB_USER=QuickMarketsDB
DB_PASSWORD=your-db-password
DB_HOST=quickmarkets-db.cev286m487pi.us-east-1.rds.amazonaws.com
DB_PORT=5432
```

### 5. Start Timer Service

```bash
# Run the setup script
./timer-start.sh

# Or manually:
docker-compose -f docker-compose.timer.yml up -d
```

## 🎮 Controlling the Timer

Use the control script to manage the timer service:

```bash
# Start timer
./timer-control.sh start

# Stop timer  
./timer-control.sh stop

# Restart timer
./timer-control.sh restart

# Check status
./timer-control.sh status

# View logs
./timer-control.sh logs
```

## 📊 Monitoring

### Check if Timer is Running
```bash
# On timer instance
docker-compose -f docker-compose.timer.yml ps

# Check logs
docker-compose -f docker-compose.timer.yml logs -f
```

### Check Database
```bash
# Connect to your main app and check timer status
curl http://YOUR_MAIN_APP_IP/api/timer/
```

## 💰 Cost Optimization

### Auto Start/Stop with AWS Lambda (Optional)

Create a Lambda function to automatically start/stop your timer instance:

1. **Create Lambda Function**:
   - Runtime: Python 3.9
   - Role: EC2 full access

2. **Lambda Code**:
```python
import boto3

def lambda_handler(event, context):
    ec2 = boto3.client('ec2')
    
    if event['action'] == 'start':
        ec2.start_instances(InstanceIds=['YOUR_TIMER_INSTANCE_ID'])
    elif event['action'] == 'stop':
        ec2.stop_instances(InstanceIds=['YOUR_TIMER_INSTANCE_ID'])
    
    return {'statusCode': 200}
```

3. **Set up CloudWatch Events** to trigger start/stop at specific times

### Manual Start/Stop
```bash
# Start instance
aws ec2 start-instances --instance-ids i-YOUR_TIMER_INSTANCE_ID

# Stop instance  
aws ec2 stop-instances --instance-ids i-YOUR_TIMER_INSTANCE_ID
```

## 🔧 Troubleshooting

### Timer Not Starting
```bash
# Check Docker logs
docker-compose -f docker-compose.timer.yml logs

# Check database connection
docker-compose -f docker-compose.timer.yml exec timer-service python manage.py shell
```

### Database Connection Issues
- Ensure RDS security group allows connections from timer instance
- Verify database credentials in `.env` file
- Check if RDS instance is running

### Timer Service Crashes
```bash
# Restart the service
./timer-control.sh restart

# Check resource usage
docker stats
```

## 📋 Quick Commands

```bash
# Start everything
./timer-control.sh start

# Stop everything
./timer-control.sh stop

# View real-time logs
./timer-control.sh logs

# Check if running
./timer-control.sh status
```

## 🎯 Benefits

- **Independent**: Timer runs separately from main app
- **Cost Effective**: Can start/stop timer instance as needed
- **Reliable**: Dedicated instance for timer service
- **Scalable**: Can run multiple timer instances if needed
- **Easy Management**: Simple start/stop commands
