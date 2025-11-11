# AWS Deployment Guide for CareerGuide.ai

This guide explains how to deploy the CareerGuide.ai application to AWS using a modern architecture.

## Architecture Overview

### Recommended AWS Services
- **Frontend**: AWS Amplify Hosting (automatic builds from GitHub)
- **Backend (Node.js)**: Amazon ECS Fargate + Application Load Balancer
- **ML Service (Flask)**: Amazon ECS Fargate + Application Load Balancer  
- **Database**: MongoDB Atlas (already configured)
- **Container Registry**: Amazon ECR
- **CI/CD**: GitHub Actions

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured (`aws configure`)
3. **GitHub Repository** with secrets configured (see below)
4. **Docker** installed locally (for testing)

## Part 1: Setup GitHub Secrets

Navigate to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

```
AWS_REGION=us-east-1  (or your preferred region)
AWS_ACCOUNT_ID=<your-12-digit-account-id>
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
```

To get AWS credentials:
```bash
aws sts get-caller-identity  # Get Account ID
aws iam create-access-key --user-name <your-iam-user>  # Create keys
```

## Part 2: Create AWS ECR Repositories

Run these commands to create container repositories:

```bash
# Create ECR repos
aws ecr create-repository --repository-name backend --region us-east-1
aws ecr create-repository --repository-name ml-service --region us-east-1

# Note the repository URIs returned
```

## Part 3: Deploy Frontend to AWS Amplify

### Option A: Via AWS Console (Easiest)

1. Go to AWS Amplify Console: https://console.aws.amazon.com/amplify/
2. Click **"New app"** → **"Host web app"**
3. Choose **GitHub** as the repository service
4. Authorize AWS Amplify to access your GitHub account
5. Select repository: `280205/CarrierGuide.ai`
6. Branch: `main`
7. Build settings (auto-detected from `package.json`):
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd Frontend
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: Frontend/dist
       files:
         - '**/*'
     cache:
       paths:
         - Frontend/node_modules/**/*
   ```
8. **Environment variables** (add these):
   ```
   VITE_API_URL=<your-backend-url>  (will add after backend deployment)
   ```
9. Click **"Save and deploy"**
10. Wait for deployment (~3-5 minutes)
11. Note the Amplify URL (e.g., `https://main.xxxxx.amplifyapp.com`)

### Option B: Via AWS CLI

```bash
# This requires more configuration; console method recommended for first deployment
```

## Part 4: Deploy Backend & ML Service to ECS Fargate

### Step 1: Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name careerguide-cluster --region us-east-1
```

### Step 2: Create Task Execution Role

```bash
# Create IAM role for ECS tasks
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "ecs-tasks.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

# Attach required policy
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

### Step 3: Push Images to ECR (First Time)

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend
cd Backend
docker build -t backend .
docker tag backend:latest <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/backend:latest
docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/backend:latest

# Build and push ML service
cd ml-model
docker build -t ml-service .
docker tag ml-service:latest <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/ml-service:latest
docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/ml-service:latest
```

**Note**: After first manual push, GitHub Actions will handle subsequent builds automatically.

### Step 4: Create ECS Task Definitions

Create `backend-task-def.json`:
```json
{
  "family": "backend-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::<AWS_ACCOUNT_ID>:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "<AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/backend:latest",
      "portMappings": [
        {
          "containerPort": 5001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "MONGODB_URI",
          "value": "<your-mongodb-uri>"
        },
        {
          "name": "JWT_SECRET",
          "value": "<your-jwt-secret>"
        },
        {
          "name": "CLOUDINARY_CLOUD_NAME",
          "value": "<your-cloudinary-cloud-name>"
        },
        {
          "name": "CLOUDINARY_API_KEY",
          "value": "<your-cloudinary-api-key>"
        },
        {
          "name": "CLOUDINARY_API_SECRET",
          "value": "<your-cloudinary-api-secret>"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

Create `ml-service-task-def.json`:
```json
{
  "family": "ml-service-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::<AWS_ACCOUNT_ID>:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "ml-service",
      "image": "<AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/ml-service:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ml-service",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

Register task definitions:
```bash
aws ecs register-task-definition --cli-input-json file://backend-task-def.json
aws ecs register-task-definition --cli-input-json file://ml-service-task-def.json
```

### Step 5: Create Application Load Balancer

```bash
# Create security group for ALB
aws ec2 create-security-group \
  --group-name careerguide-alb-sg \
  --description "Security group for CareerGuide ALB" \
  --vpc-id <your-vpc-id>

# Allow HTTP/HTTPS inbound
aws ec2 authorize-security-group-ingress \
  --group-id <sg-id> \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id <sg-id> \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# Create ALB
aws elbv2 create-load-balancer \
  --name careerguide-alb \
  --subnets <subnet-1> <subnet-2> \
  --security-groups <sg-id> \
  --scheme internet-facing \
  --type application

# Create target groups
aws elbv2 create-target-group \
  --name backend-tg \
  --protocol HTTP \
  --port 5001 \
  --vpc-id <your-vpc-id> \
  --target-type ip \
  --health-check-path /api/auth/check

aws elbv2 create-target-group \
  --name ml-service-tg \
  --protocol HTTP \
  --port 5000 \
  --vpc-id <your-vpc-id> \
  --target-type ip \
  --health-check-path /api/profile
```

### Step 6: Create ECS Services

```bash
# Create backend service
aws ecs create-service \
  --cluster careerguide-cluster \
  --service-name backend-service \
  --task-definition backend-task \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[<subnet-1>,<subnet-2>],securityGroups=[<sg-id>],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=<backend-tg-arn>,containerName=backend,containerPort=5001"

# Create ML service
aws ecs create-service \
  --cluster careerguide-cluster \
  --service-name ml-service \
  --task-definition ml-service-task \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[<subnet-1>,<subnet-2>],securityGroups=[<sg-id>],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=<ml-service-tg-arn>,containerName=ml-service,containerPort=5000"
```

## Part 5: Configure GitHub Actions CI/CD

The `.github/workflows/ci-cd.yml` is already configured. It will:
1. Build Docker images on every push to `main`
2. Push images to ECR
3. Optionally update ECS services (you can add this)

To enable automatic ECS updates, add to the workflow after image push:

```yaml
- name: Update Backend ECS Service
  run: |
    aws ecs update-service \
      --cluster careerguide-cluster \
      --service backend-service \
      --force-new-deployment

- name: Update ML Service ECS
  run: |
    aws ecs update-service \
      --cluster careerguide-cluster \
      --service ml-service \
      --force-new-deployment
```

## Part 6: Update Frontend Environment Variables

1. Go to Amplify Console
2. Select your app → Environment variables
3. Add/Update:
   ```
   VITE_BACKEND_URL=http://<alb-dns-name>
   VITE_ML_SERVICE_URL=http://<alb-dns-name>
   ```
4. Redeploy frontend

## Part 7: Configure Custom Domain (Optional)

1. Purchase domain in Route 53 or use existing domain
2. In Amplify Console: Domain management → Add domain
3. Follow the prompts to configure DNS
4. For backend: Create Route 53 alias record pointing to ALB

## Monitoring and Logs

### View ECS Logs
```bash
aws logs tail /ecs/backend --follow
aws logs tail /ecs/ml-service --follow
```

### View Amplify Build Logs
Go to Amplify Console → App → Build history → View logs

## Cost Estimation

- **Amplify Hosting**: ~$0-5/month (build minutes + storage)
- **ECS Fargate**: ~$25-50/month (2 tasks, 0.5 vCPU, 1GB RAM each)
- **ALB**: ~$20/month
- **ECR**: ~$0-2/month (storage)
- **Data Transfer**: Variable

**Total**: ~$50-80/month

## Troubleshooting

### Frontend not connecting to backend
- Check CORS settings in Backend `index.js`
- Verify ALB security group allows traffic
- Check Amplify environment variables

### ECS tasks failing
- Check CloudWatch logs: `/ecs/backend` and `/ecs/ml-service`
- Verify ECR image exists and is accessible
- Check task execution role permissions

### GitHub Actions failing
- Verify GitHub secrets are set correctly
- Check ECR repository names match workflow
- Ensure IAM user has ECR push permissions

## Next Steps

1. ✅ Code is already on GitHub
2. Set up AWS ECR repositories
3. Deploy frontend to Amplify
4. Deploy backend/ML to ECS
5. Configure custom domain
6. Set up monitoring/alerts

## Support

For issues, create a GitHub issue or contact the team.
