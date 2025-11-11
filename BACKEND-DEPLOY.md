# 🚀 Backend Deployment Guide (AWS App Runner)

## Prerequisites
✅ Frontend deployed on Amplify  
✅ MongoDB Atlas running (already configured)  
✅ Docker installed locally (check with `docker --version`)  
✅ AWS CLI installed (or use CloudShell)

---

## Option A: Deploy via AWS Console (Recommended - 10 mins)

### Step 1: Push Docker Image to Amazon ECR

#### 1.1 Open AWS CloudShell
- Go to AWS Console → Click the **CloudShell icon** (terminal icon) in the top navigation bar
- Wait for CloudShell to initialize (~30 seconds)

#### 1.2 Clone Your Repository
```bash
git clone https://github.com/280205/CarrierGuide.ai.git
cd CarrierGuide.ai/Backend
```

#### 1.3 Create ECR Repository
```bash
# Set your region
export AWS_REGION=us-east-1

# Create ECR repository for backend
aws ecr create-repository \
  --repository-name carrierguide-backend \
  --region $AWS_REGION

# Note down the repositoryUri from the output (looks like: ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/carrierguide-backend)
```

#### 1.4 Build and Push Docker Image
```bash
# Get your AWS account ID
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export ECR_REPO_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/carrierguide-backend

# Authenticate Docker to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO_URI

# Build the Docker image
docker build -t carrierguide-backend .

# Tag the image
docker tag carrierguide-backend:latest $ECR_REPO_URI:latest

# Push to ECR
docker push $ECR_REPO_URI:latest

# Copy the image URI - you'll need it for App Runner
echo "Image URI: $ECR_REPO_URI:latest"
```

---

### Step 2: Deploy to AWS App Runner

#### 2.1 Open App Runner Console
- Go to AWS Console → Search for **"App Runner"**
- Click **"Create service"**

#### 2.2 Configure Source
- **Source:** Container registry
- **Provider:** Amazon ECR
- **Container image URI:** Paste the ECR URI from Step 1.4 (e.g., `123456789012.dkr.ecr.us-east-1.amazonaws.com/carrierguide-backend:latest`)
- **Deployment trigger:** Manual (you can enable automatic later)
- Click **"Next"**

#### 2.3 Configure Service Settings
**Service settings:**
- **Service name:** `carrierguide-backend`
- **Virtual CPU:** 1 vCPU
- **Virtual memory:** 2 GB
- **Port:** `5001`

**Environment variables:** Click "Add environment variable" for each:
```
MONGODB_URI = mongodb+srv://nitinpandey280204:1RLwuuwEUaqbQCh6@cluster0.x9i2j.mongodb.net/chat_db?retryWrites=true&w=majority&appName=Cluster0
PORT = 5001
JWT_SECRET = mySuperSecretKey
NODE_ENV = production
CLOUDINARY_CLOUD_NAME = dij1ubkba
CLOUDINARY_API_KEY = 166849187519641
CLOUDINARY_API_SECRET = TpKZYHlTloP6wzECJDTpyh1jFMs
FRONTEND_URL = https://main.d3m76uhk572izp.amplifyapp.com
```

**⚠️ IMPORTANT:** Make sure to add the Amplify frontend URL to `FRONTEND_URL` for CORS!

#### 2.4 Configure Auto Scaling (Optional)
- **Min instances:** 1
- **Max instances:** 3
- **Max concurrency:** 100

#### 2.5 Configure Health Check
- **Health check path:** `/` or `/api/health` (if you have one)
- **Health check interval:** 20 seconds
- **Health check timeout:** 5 seconds
- **Unhealthy threshold:** 3

#### 2.6 Review and Create
- Review all settings
- Click **"Create & deploy"**
- Wait 5-10 minutes for deployment to complete

#### 2.7 Get Backend URL
- Once deployed, you'll see a **Service URL** like: `https://abc123.us-east-1.awsapprunner.com`
- **Copy this URL** - you'll need to update your frontend!

---

### Step 3: Update Frontend with Backend URL

#### 3.1 Go to AWS Amplify Console
- Open your **CarrierGuide.ai** app
- Go to **Environment variables**

#### 3.2 Update VITE_API_URL
- Delete the existing `VITE_API_URL` variable
- Add new variable:
  - **Variable name:** `VITE_API_URL`
  - **Value:** Your App Runner URL (e.g., `https://abc123.us-east-1.awsapprunner.com`)
- Click **"Save"**

#### 3.3 Redeploy Frontend
- Go to **Deployments** tab
- Click **"Redeploy this version"**
- Wait ~2 minutes for redeployment

---

### Step 4: Deploy ML Service (Optional - Similar Process)

#### 4.1 In CloudShell
```bash
# Navigate to ML model directory
cd ~/CarrierGuide.ai/Backend/ml-model

# Create ECR repository for ML service
aws ecr create-repository \
  --repository-name carrierguide-ml-service \
  --region $AWS_REGION

# Build and push ML service image
export ML_ECR_REPO_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/carrierguide-ml-service

docker build -t carrierguide-ml-service .
docker tag carrierguide-ml-service:latest $ML_ECR_REPO_URI:latest
docker push $ML_ECR_REPO_URI:latest

echo "ML Service Image URI: $ML_ECR_REPO_URI:latest"
```

#### 4.2 Create Another App Runner Service
- Follow the same steps as Step 2
- **Service name:** `carrierguide-ml-service`
- **Port:** `5000`
- **No environment variables needed** (ML service is stateless)

---

## Option B: Deploy via AWS CLI (Advanced - 15 mins)

If you prefer full automation, use the CLI script below:

```bash
# Set variables
export AWS_REGION=us-east-1
export SERVICE_NAME=carrierguide-backend
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Create IAM role for App Runner
aws iam create-role \
  --role-name AppRunnerECRAccessRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "build.apprunner.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

aws iam attach-role-policy \
  --role-name AppRunnerECRAccessRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess

# Create App Runner service
aws apprunner create-service \
  --service-name $SERVICE_NAME \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "'$AWS_ACCOUNT_ID'.dkr.ecr.'$AWS_REGION'.amazonaws.com/carrierguide-backend:latest",
      "ImageRepositoryType": "ECR",
      "ImageConfiguration": {
        "Port": "5001",
        "RuntimeEnvironmentVariables": {
          "MONGODB_URI": "mongodb+srv://nitinpandey280204:1RLwuuwEUaqbQCh6@cluster0.x9i2j.mongodb.net/chat_db",
          "PORT": "5001",
          "JWT_SECRET": "mySuperSecretKey",
          "NODE_ENV": "production",
          "CLOUDINARY_CLOUD_NAME": "dij1ubkba",
          "CLOUDINARY_API_KEY": "166849187519641",
          "CLOUDINARY_API_SECRET": "TpKZYHlTloP6wzECJDTpyh1jFMs",
          "FRONTEND_URL": "https://main.d3m76uhk572izp.amplifyapp.com"
        }
      }
    },
    "AutoDeploymentsEnabled": false,
    "AuthenticationConfiguration": {
      "AccessRoleArn": "arn:aws:iam::'$AWS_ACCOUNT_ID':role/AppRunnerECRAccessRole"
    }
  }' \
  --instance-configuration '{
    "Cpu": "1 vCPU",
    "Memory": "2 GB"
  }' \
  --region $AWS_REGION
```

---

## 🎯 Quick Verification

After deployment, test your backend:

### Test Backend Health
```bash
curl https://YOUR-APP-RUNNER-URL.awsapprunner.com
```

### Test Frontend Connection
1. Open your Amplify URL: `https://main.d3m76uhk572izp.amplifyapp.com`
2. Try to sign up / log in
3. Check browser console for any errors

---

## 🔧 Troubleshooting

### Issue: App Runner service fails to start
**Solution:** Check CloudWatch Logs
- Go to App Runner service → **Logs** tab
- Look for startup errors
- Common issues:
  - Port mismatch (ensure PORT=5001 in env vars)
  - Missing environment variables
  - Database connection issues

### Issue: CORS errors in browser
**Solution:** Verify FRONTEND_URL is set correctly in App Runner environment variables

### Issue: Cannot connect to MongoDB
**Solution:** 
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Go to MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere

### Issue: 502 Bad Gateway
**Solution:** 
- Service is starting but not responding on correct port
- Verify `PORT=5001` in environment variables
- Check Dockerfile `EXPOSE 5001` (you may need to fix this!)

---

## 📊 Expected Costs

- **App Runner:** ~$25-40/month (1 vCPU, 2GB RAM, always running)
- **ECR Storage:** ~$0.10/month (minimal image storage)
- **Data Transfer:** Depends on usage

**To minimize costs:**
- Use "Provisioned" instances (cheaper than "Automatic")
- Enable auto-scaling to scale to 0 during low traffic (if supported)

---

## ✅ Success Checklist

- [ ] Docker image built and pushed to ECR
- [ ] App Runner service created and running
- [ ] Backend URL obtained from App Runner
- [ ] Frontend environment variable `VITE_API_URL` updated
- [ ] Frontend redeployed
- [ ] Signup/Login working end-to-end
- [ ] ML service deployed (optional)

---

## 🚀 Next Steps

1. **Set up custom domain** (optional):
   - Go to App Runner → Custom domains → Add your domain
   - Update DNS records as instructed

2. **Enable CI/CD** (optional):
   - Enable automatic deployments in App Runner
   - Update GitHub Actions to trigger App Runner deployments

3. **Monitor your application**:
   - CloudWatch Logs for debugging
   - App Runner metrics for performance monitoring

Need help? Let me know! 🎉
