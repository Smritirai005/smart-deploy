# 🚀 Smart Deploy - Multi-Agent Deployment Platform

A modern, AI-powered deployment platform that automates the entire deployment workflow from planning to execution. Built with Next.js, Express, and powered by Groq AI, this platform intelligently generates deployment plans, creates necessary configuration files, and deploys applications to various platforms.

## ✨ Features

- **🤖 AI-Powered Planning**: Uses Groq AI to analyze deployment requests and generate structured deployment plans
- **📋 Automated Config Generation**: Automatically generates Dockerfiles, GitHub Actions workflows, and Railway configurations
- **🎨 Modern UI**: Beautiful, responsive interface with light/dark theme support
- **🚂 Multi-Platform Support**: Deploy to Railway, Vercel, Docker, AWS, Heroku, and more
- **⚡ Real-time Deployment**: Track deployment status in real-time
- **🔒 Secure**: Environment variables and secrets are properly handled
- **🔄 CI/CD Integration**: Built-in GitHub Actions workflow generation

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling with dark mode support
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Express.js** - Web framework
- **Groq AI** - AI-powered planning and config generation
- **Inngest** - Workflow orchestration
- **Railway MCP** - Railway platform integration

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Groq API key ([Get one here](https://console.groq.com/))
- Railway API token (optional, for Railway deployments)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Smritirai005/smart-deploy.git
   cd smart-deploy
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Install MCP server dependencies** (optional, for Railway integration)
   ```bash
   cd ../mcp-server
   npm install
   ```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Groq API Key (Required)
GROQ_API_KEY=your_groq_api_key_here

# Railway API Token (Optional, for Railway deployments)
RAILWAY_API_TOKEN=your_railway_token_here

# Inngest Event Key (Optional, for workflow orchestration)
INNGEST_EVENT_KEY=your_inngest_key_here

# Server Port (Optional, defaults to 3001)
PORT=3001
```

### Frontend Configuration

The frontend is configured to connect to `http://localhost:3001/api` by default. To change this, update the `API_URL` constant in `frontend/src/app/page.tsx`.

## 🚀 Usage

### Starting the Development Servers

1. **Start the backend server**
   ```bash
   cd backend
   node server.js
   ```
   The backend will run on `http://localhost:3001`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

### Using the Platform

1. **Open the application** in your browser at `http://localhost:3000`

2. **Enter a deployment request** in the text area, for example:
   - "Deploy my Next.js app with Docker + Railway"
   - "Deploy a React app to Vercel"
   - "Set up a Node.js API on AWS with Docker"

3. **Generate Plan**: Click "Generate Plan" to get an AI-generated deployment plan

4. **Generate Configs**: After reviewing the plan, click "Generate Configs" to create:
   - Dockerfile
   - GitHub Actions workflow
   - Railway configuration

5. **Deploy**: Click "Deploy Now" to start the deployment process

## 📁 Project Structure

```
smart-deploy/
├── backend/
│   ├── agents/
│   │   ├── planner.js          # AI-powered deployment planner
│   │   └── configGenerator.js  # Config file generator
│   ├── inngest/
│   │   ├── client.js           # Inngest client setup
│   │   ├── functions.js        # Deployment workflow functions
│   │   └── serve.js            # Inngest server
│   ├── routes/
│   │   ├── deployment.js       # Deployment API routes
│   │   └── status.js           # Status check routes
│   ├── server.js               # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx        # Main application page
│   │       ├── layout.tsx      # Root layout
│   │       └── globals.css     # Global styles
│   └── package.json
├── mcp-server/
│   ├── railway-mcp.js          # Railway MCP integration
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Deployment Planning
```http
POST /api/deployment/plan
Content-Type: application/json

{
  "request": "Deploy my Next.js app with Docker + Railway"
}
```

**Response:**
```json
{
  "success": true,
  "plan": {
    "framework": "nextjs",
    "deploymentTarget": "railway",
    "steps": [...],
    "requirements": [...],
    "estimatedTime": "5-10 minutes"
  }
}
```

### Generate Configs
```http
POST /api/deployment/generate-configs
Content-Type: application/json

{
  "framework": "nextjs",
  "projectDetails": {
    "serviceName": "my-app"
  }
}
```

**Response:**
```json
{
  "success": true,
  "configs": {
    "dockerfile": "...",
    "githubActions": "...",
    "railwayConfig": "..."
  }
}
```

### Deploy
```http
POST /api/deployment/deploy
Content-Type: application/json

{
  "projectName": "my-deployment",
  "dockerfile": "...",
  "envVars": {},
  "webhookUrl": "http://localhost:3000/api/webhook"
}
```

## 🎨 Features in Detail

### AI-Powered Planning
The platform uses Groq's Llama 3.3 70B model to analyze deployment requests and generate comprehensive deployment plans with:
- Framework detection
- Deployment target recommendation
- Step-by-step deployment process
- Required tools and dependencies
- Time estimates

### Config Generation
Automatically generates production-ready configuration files:
- **Dockerfile**: Optimized for the detected framework
- **GitHub Actions**: CI/CD pipeline configuration
- **Railway Config**: Platform-specific deployment settings

### Modern UI
- **Light/Dark Theme**: Toggle between themes with persistent preference
- **Responsive Design**: Works on all screen sizes
- **Real-time Feedback**: Loading states and error handling
- **Code Display**: Syntax-highlighted code blocks with proper contrast

## 🔒 Security

- Environment variables are never committed to git
- `.env` files are excluded via `.gitignore`
- API keys are stored securely in environment variables
- GitHub push protection prevents accidental secret commits

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for AI capabilities
- [Railway](https://railway.app/) for deployment platform
- [Inngest](https://www.inngest.com/) for workflow orchestration
- [Next.js](https://nextjs.org/) and [Express](https://expressjs.com/) communities

## 📧 Support

For issues, questions, or contributions, please open an issue on the [GitHub repository](https://github.com/Smritirai005/smart-deploy/issues).

---

Made with ❤️ by [Smritirai005](https://github.com/Smritirai005)



