# CareerGuide.ai - AI-Powered Career Mentor

AI-powered career guidance platform with personalized recommendations, real-time mentorship, and industry insights.

## 🚀 Live Demo

- **GitHub**: https://github.com/280205/CarrierGuide.ai
- **Frontend**: [Will be deployed on AWS Amplify]
- **Backend API**: [Will be deployed on AWS ECS]

## 📋 Features

- ✨ Personalized career recommendations based on skills, interests, and experience
- 💬 Real-time chat with AI career mentor
- 📊 Industry insights and market trends
- 🎯 Skill gap analysis and learning path suggestions
- 👤 User profile management
- 🔐 Secure authentication with JWT

## 🏗️ Architecture

```
Frontend (React + Vite + TailwindCSS)
         ↓
    ALB (AWS)
    ↙        ↘
Backend         ML Service
(Node.js)      (Flask + scikit-learn)
   ↓
MongoDB Atlas
```

## 🛠️ Tech Stack

### Frontend
- React 18.2 + Vite 6
- TailwindCSS + DaisyUI
- Zustand (state management)
- Socket.io-client
- React Router

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.io (real-time chat)
- JWT authentication
- Cloudinary (media storage)

### ML Service
- Flask
- scikit-learn
- pandas, numpy
- joblib

## 📦 Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB Atlas account

### Quick Start

```bash
# Clone repository
git clone https://github.com/280205/CarrierGuide.ai.git
cd CarrierGuide.ai

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install

# Install Python dependencies
cd ../Backend/ml-model
pip install -r requirements.txt

# Configure Backend/.env (see below)

# Start Backend (Terminal 1)
cd Backend
npm run dev

# Start ML Service (Terminal 2)
cd Backend/ml-model
python app.py

# Start Frontend (Terminal 3)
cd Frontend
npm run dev
```

Access at `http://localhost:5173`

### Environment Variables

Create `Backend/.env`:
```env
MONGODB_URI=your-mongodb-connection-string
PORT=5001
JWT_SECRET=your-secret-key
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## ☁️ AWS Deployment

See **[AWS-DEPLOYMENT.md](./AWS-DEPLOYMENT.md)** for complete deployment guide.

### Quick Deploy Steps

1. **Setup AWS Infrastructure**:
   ```bash
   chmod +x deploy-aws-setup.sh
   ./deploy-aws-setup.sh
   ```

2. **Deploy Frontend** (AWS Amplify Console):
   - Connect GitHub repo
   - Auto-deploy on push to `main`

3. **Deploy Backend/ML** (ECS Fargate):
   - Push Docker images to ECR
   - Create ECS services
   - Configure ALB

### CI/CD with GitHub Actions

Push to `main` triggers:
- Docker image builds
- Push to AWS ECR
- Optional: ECS service updates

**Required GitHub Secrets**:
- `AWS_REGION`
- `AWS_ACCOUNT_ID`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## 🐳 Docker

```bash
# Build
docker build -t backend ./Backend
docker build -t ml-service ./Backend/ml-model
docker build -t frontend ./Frontend

# Run
docker run -p 5001:5001 --env-file Backend/.env backend
docker run -p 5000:5000 ml-service
docker run -p 80:80 frontend
```

## 📁 Project Structure

```
├── Frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Route pages
│   │   ├── store/        # State management
│   │   └── lib/          # Utilities
│   └── Dockerfile
│
├── Backend/              # Node.js + Express API
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API endpoints
│   │   └── lib/          # DB, Socket.io
│   ├── ml-model/         # Python Flask ML API
│   │   ├── app.py
│   │   ├── model/        # Trained models
│   │   └── Dockerfile
│   └── Dockerfile
│
├── .github/workflows/    # CI/CD pipelines
├── AWS-DEPLOYMENT.md     # Deployment guide
└── deploy-aws-setup.sh   # AWS setup script
```

## 🧪 Testing

```bash
# Lint frontend
cd Frontend && npm run lint

# Build frontend
npm run build

# Test backend
cd Backend && npm test  # (add tests)
```

## 🤝 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/Feature`)
3. Commit changes (`git commit -m 'Add Feature'`)
4. Push (`git push origin feature/Feature`)
5. Open Pull Request

## 📄 License

MIT License

## 👥 Author

**Nitin Pandey** - [@280205](https://github.com/280205)

## 📞 Support

- GitHub Issues: [Report a bug](https://github.com/280205/CarrierGuide.ai/issues)
- Email: support@careerguide.ai

---

Made with ❤️ by the CareerGuide.ai Team