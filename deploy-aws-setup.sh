#!/bin/bash

# CareerGuide.ai - AWS Deployment Setup Script
# This script automates the initial AWS infrastructure setup

set -e

echo "🚀 CareerGuide.ai - AWS Deployment Setup"
echo "========================================="
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first."
    exit 1
fi

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=${AWS_REGION:-us-east-1}

echo "✅ AWS Account ID: $AWS_ACCOUNT_ID"
echo "✅ AWS Region: $AWS_REGION"
echo ""

# Step 1: Create ECR Repositories
echo "📦 Creating ECR repositories..."
aws ecr create-repository --repository-name backend --region $AWS_REGION 2>/dev/null || echo "  ℹ️  backend repository already exists"
aws ecr create-repository --repository-name ml-service --region $AWS_REGION 2>/dev/null || echo "  ℹ️  ml-service repository already exists"
echo "✅ ECR repositories ready"
echo ""

# Step 2: Create ECS Cluster
echo "🏗️  Creating ECS cluster..."
aws ecs create-cluster --cluster-name careerguide-cluster --region $AWS_REGION 2>/dev/null || echo "  ℹ️  Cluster already exists"
echo "✅ ECS cluster ready"
echo ""

# Step 3: Create IAM Role for ECS
echo "🔐 Creating ECS Task Execution Role..."
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "ecs-tasks.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }' 2>/dev/null || echo "  ℹ️  Role already exists"

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy 2>/dev/null || true
echo "✅ IAM role configured"
echo ""

# Step 4: Create CloudWatch Log Groups
echo "📊 Creating CloudWatch log groups..."
aws logs create-log-group --log-group-name /ecs/backend --region $AWS_REGION 2>/dev/null || echo "  ℹ️  /ecs/backend log group already exists"
aws logs create-log-group --log-group-name /ecs/ml-service --region $AWS_REGION 2>/dev/null || echo "  ℹ️  /ecs/ml-service log group already exists"
echo "✅ CloudWatch log groups ready"
echo ""

# Step 5: Login to ECR
echo "🔑 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
echo "✅ ECR login successful"
echo ""

echo "========================================="
echo "✅ AWS Infrastructure Setup Complete!"
echo "========================================="
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Build and push Docker images:"
echo "   cd Backend"
echo "   docker build -t backend ."
echo "   docker tag backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/backend:latest"
echo "   docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/backend:latest"
echo ""
echo "   cd Backend/ml-model"
echo "   docker build -t ml-service ."
echo "   docker tag ml-service:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/ml-service:latest"
echo "   docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/ml-service:latest"
echo ""
echo "2. Deploy Frontend to AWS Amplify:"
echo "   - Go to: https://console.aws.amazon.com/amplify/"
echo "   - Connect your GitHub repo: 280205/CarrierGuide.ai"
echo "   - Follow the setup wizard"
echo ""
echo "3. Create ECS Services (see AWS-DEPLOYMENT.md for details)"
echo ""
echo "4. Configure GitHub Secrets for CI/CD:"
echo "   AWS_REGION=$AWS_REGION"
echo "   AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID"
echo "   AWS_ACCESS_KEY_ID=<your-access-key>"
echo "   AWS_SECRET_ACCESS_KEY=<your-secret-key>"
echo ""
echo "📖 Full documentation: AWS-DEPLOYMENT.md"
