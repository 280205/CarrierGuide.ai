@echo off
echo ========================================
echo Backend Deployment Script
echo ========================================
echo.

REM Set variables
set AWS_REGION=us-east-1
set REPO_NAME=carrierguide-backend

echo Step 1: Getting AWS Account ID...
for /f "tokens=*" %%i in ('aws sts get-caller-identity --query Account --output text') do set AWS_ACCOUNT_ID=%%i
echo Account ID: %AWS_ACCOUNT_ID%
echo.

echo Step 2: Creating ECR Repository...
aws ecr create-repository --repository-name %REPO_NAME% --region %AWS_REGION% 2>nul
if errorlevel 1 (
    echo Repository already exists or error occurred, continuing...
) else (
    echo Repository created successfully!
)
echo.

echo Step 3: Logging into ECR...
aws ecr get-login-password --region %AWS_REGION% | docker login --username AWS --password-stdin %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com
if errorlevel 1 (
    echo ERROR: Failed to login to ECR
    echo Please make sure AWS CLI is configured with: aws configure
    pause
    exit /b 1
)
echo Login successful!
echo.

echo Step 4: Building Docker image...
cd Backend
docker build -t %REPO_NAME% .
if errorlevel 1 (
    echo ERROR: Docker build failed
    pause
    exit /b 1
)
cd ..
echo Build successful!
echo.

echo Step 5: Tagging image...
docker tag %REPO_NAME%:latest %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com/%REPO_NAME%:latest
echo.

echo Step 6: Pushing to ECR (this may take 2-3 minutes)...
docker push %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com/%REPO_NAME%:latest
if errorlevel 1 (
    echo ERROR: Failed to push image
    pause
    exit /b 1
)
echo.

echo ========================================
echo SUCCESS! Image uploaded to ECR
echo ========================================
echo.
echo Image URI: %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com/%REPO_NAME%:latest
echo.
echo COPY THE IMAGE URI ABOVE - YOU'LL NEED IT!
echo.
echo Next steps:
echo 1. Go to AWS App Runner Console
echo 2. Create service from Container Registry
echo 3. Use the Image URI above
echo.
pause
