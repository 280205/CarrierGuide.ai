# Quick Deploy Guide - CareerGuide.ai (~15 minutes)

This guide will get your app live on AWS quickly without requiring AWS CLI locally.

## ✅ Prerequisites Checklist
- [ ] AWS Account created
- [ ] GitHub repository pushed (✅ Already done!)
- [ ] MongoDB Atlas connection string ready (✅ Already have it)
- [ ] Cloudinary credentials ready (✅ Already have it)

---

## 🚀 Part 1: Deploy Frontend to AWS Amplify (5 minutes)

### Step 1: Open AWS Amplify Console
1. Go to: https://console.aws.amazon.com/amplify/
2. Click **"New app"** → **"Host web app"**

### Step 2: Connect GitHub
1. Choose **GitHub** as the repository service
2. Click **"Authorize AWS Amplify"** (sign in to GitHub if needed)
3. Select repository: **280205/CarrierGuide.ai**
4. Branch: **main**
5. Click **"Next"**

### Step 3: Configure Build Settings
The build settings should auto-detect. Verify they look like this:

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

### Step 4: Add Environment Variables
Click **"Advanced settings"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `http://localhost:5001` (we'll update this later) |

### Step 5: Deploy
1. Click **"Save and deploy"**
2. Wait 3-5 minutes for build to complete
3. Copy the Amplify URL (e.g., `https://main.xxxxx.amplifyapp.com`)

✅ **Frontend is now live!**

---

## 🐳 Part 2: Deploy Backend to AWS (Option A - Simplified)

Since AWS CLI isn't installed locally, I'll provide **two options**:

### Option A: Use AWS CloudShell (Easiest - No local setup)

#### Step 1: Open AWS CloudShell
1. Go to AWS Console: https://console.aws.amazon.com
2. Click the CloudShell icon (>_) in the top-right toolbar
3. Wait for CloudShell to initialize (~30 seconds)

#### Step 2: Clone Your Repository
```bash
git clone https://github.com/280205/CarrierGuide.ai.git
cd CarrierGuide.ai
```

#### Step 3: Set AWS Region
```bash
export AWS_REGION=us-east-1
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "Account ID: $AWS_ACCOUNT_ID"
```

#### Step 4: Create ECR Repositories
```bash
aws ecr create-repository --repository-name backend --region $AWS_REGION
aws ecr create-repository --repository-name ml-service --region $AWS_REGION
```

#### Step 5: Create ECS Cluster
```bash
aws ecs create-cluster --cluster-name careerguide-cluster --region $AWS_REGION
```

#### Step 6: Create IAM Role
```bash
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

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

#### Step 7: Create Log Groups
```bash
aws logs create-log-group --log-group-name /ecs/backend --region $AWS_REGION
aws logs create-log-group --log-group-name /ecs/ml-service --region $AWS_REGION
```

#### Step 8: Build and Push Docker Images
```bash
# Login to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build and push backend
cd Backend
docker build -t backend .
docker tag backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/backend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/backend:latest

# Build and push ML service
cd ml-model
docker build -t ml-service .
docker tag ml-service:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/ml-service:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/ml-service:latest
```

---

### Option B: Use AWS App Runner (Even Simpler - But costs slightly more)

#### Backend via App Runner (5 minutes)

1. **Go to AWS App Runner Console**: https://console.aws.amazon.com/apprunner/
2. Click **"Create service"**
3. **Source**:
   - Repository type: **Container registry**
   - Provider: **Amazon ECR**
   - Browse and select: `backend:latest`
   - Deployment trigger: **Automatic**
4. **Deployment settings**:
   - Service name: `backend-service`
   - Port: `5001`
   - Environment variables:
     ```
     MONGODB_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     NODE_ENV=production
     CLOUDINARY_CLOUD_NAME=<your-name>
     CLOUDINARY_API_KEY=<your-key>
     CLOUDINARY_API_SECRET=<your-secret>
     PORT=5001
     ```
5. Click **"Create & deploy"**
6. Wait 3-5 minutes
7. Copy the App Runner URL (e.g., `https://xxxxx.us-east-1.awsapprunner.com`)

#### ML Service via App Runner

1. Repeat the same process for ML service
2. Container: `ml-service:latest`
3. Port: `5000`
4. No environment variables needed
5. Copy the ML service URL

---

## 🔗 Part 3: Connect Everything (3 minutes)

### Update Frontend Environment
1. Go back to AWS Amplify Console
2. Select your app → **Environment variables**
3. Update:
   ```
   VITE_API_URL=<your-backend-url>
   ```
4. Click **"Save"**
5. Go to **"Redeploy this version"**

### Update Backend CORS
The backend needs to allow the Amplify URL. I'll create a quick fix:

```javascript
// In Backend/src/index.js, update CORS to:
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://main.xxxxx.amplifyapp.com",  // Add your Amplify URL
    ],
    credentials: true,
  })
);
```

Then commit and push:
```bash
git add Backend/src/index.js
git commit -m "Update CORS for production"
git push origin main
```

---

## ✅ Verification Checklist

- [ ] Frontend loads at Amplify URL
- [ ] Can sign up / log in
- [ ] Can view dashboard
- [ ] ML recommendations work
- [ ] Chat functionality works

---

## 📊 What You've Deployed

| Service | Technology | AWS Service | Cost/Month |
|---------|-----------|-------------|------------|
| Frontend | React + Vite | AWS Amplify | ~$0-5 |
| Backend | Node.js + Express | App Runner or ECS | ~$15-30 |
| ML Service | Flask + scikit-learn | App Runner or ECS | ~$15-30 |
| Database | MongoDB | Atlas (external) | Free tier |

**Total**: ~$30-65/month

---

## 🎯 Next Steps

1. **Set up Custom Domain** (Optional):
   - In Amplify: Domain management → Add domain
   - Follow DNS configuration steps

2. **Enable Auto-Deploy**:
   - Already configured! Push to `main` branch auto-deploys frontend
   - Set up GitHub Actions for backend (see `.github/workflows/ci-cd.yml`)

3. **Monitor & Scale**:
   - View logs in CloudWatch
   - Adjust App Runner instance size if needed
   - Enable auto-scaling for ECS if using ECS

---

## 🆘 Troubleshooting

### Frontend deploys but shows blank page
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly
- Check Amplify build logs

### Backend not responding
- Check CloudWatch logs
- Verify environment variables are set
- Test health endpoint: `https://your-backend-url/api/auth/check`

### CORS errors
- Add Amplify URL to CORS whitelist in `Backend/src/index.js`
- Redeploy backend

### Database connection failed
- Verify MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for AWS)
- Check connection string format

---

## 📝 Important Notes

1. **First-time setup**: Backend images need to be built and pushed to ECR before App Runner can use them
2. **MongoDB Atlas**: Make sure to whitelist AWS IP ranges or use 0.0.0.0/0 for production
3. **Secrets**: Never commit `.env` files - use AWS Secrets Manager for production
4. **Costs**: AWS Free Tier covers some usage, but monitor your bill

---

## 🎉 You're Live!

Your app is now deployed and accessible worldwide. Share your Amplify URL!

For advanced deployment options (ECS with Load Balancer, auto-scaling, etc.), see `AWS-DEPLOYMENT.md`.
