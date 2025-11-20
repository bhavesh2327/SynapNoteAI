# 🧠 SynapNote

> An intelligent note-taking application powered by AI that revolutionizes how you create, organize, and interact with your notes.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.1.0-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://mongodb.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini%20AI-2.5--flash-orange.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🔗 API Endpoints](#-api-endpoints)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨‍💻 Author](#-author)

## ✨ Features

### 🎯 Core Features
- **Smart Note Creation**: Create and manage notes with rich content
- **AI-Powered Summaries**: Automatically generate concise summaries of your notes
- **Intelligent Keywords**: Extract relevant keywords from note content using AI
- **Advanced Search**: Find notes quickly with intelligent search capabilities
- **Tagging System**: Organize notes with customizable tags
- **Pin & Archive**: Pin important notes and archive completed ones

### 🤖 AI-Powered Features
- **Conversational AI**: Chat with an AI assistant about your notes
- **Content Enhancement**: Improve your notes with AI suggestions
- **Smart Organization**: AI helps categorize and organize your content
- **Contextual Insights**: Get relevant insights based on your note content

### 🔐 Security & Authentication
- **Secure Authentication**: JWT-based authentication system
- **Email Verification**: OTP-based email verification for account security
- **Password Protection**: Bcrypt encryption for secure password storage
- **CORS Configuration**: Secure cross-origin resource sharing

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18.x
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **AI Integration**: Google Generative AI (Gemini 2.5 Flash)
- **Email Service**: Nodemailer
- **Security**: Bcrypt.js, CORS

### Development Tools
- **Process Manager**: Nodemon for development
- **Environment Management**: Dotenv
- **API Documentation**: Comprehensive API docs in `Apis.md`

## 🚀 Quick Start

1. **Clone the repository**
   ```powershell
   git clone https://github.com/Amarnath-18/Intellinotes.git
   cd Intellinotes
   ```

2. **Install dependencies**
   ```powershell
   cd backend
   npm install
   ```

3. **Set up environment variables**
   ```powershell
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```powershell
   npm run dev
   ```

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- MongoDB (local or cloud instance)
- Google Gemini AI API key
- Email service credentials (for notifications)

### Step-by-step Installation

1. **Clone and Navigate**
   ```powershell
   git clone https://github.com/Amarnath-18/Intellinotes.git
   cd Intellinotes/backend
   ```

2. **Install Dependencies**
   ```powershell
   npm install
   ```

3. **Database Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a new database for SynapNote

## ⚙️ Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/intellinotes
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/intellinotes

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Google Gemini AI
GEMINI_API_KEY=your-google-gemini-api-key

# Email Configuration (for OTP and notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | No (default: 5000) |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `GEMINI_API_KEY` | Google Gemini AI API key | Yes |
| `EMAIL_*` | Email service configuration | Yes |
| `FRONTEND_URL` | Frontend application URL | No |

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /signup` - Create new user account
- `POST /verify-otp` - Verify email with OTP
- `POST /signin` - Sign in user
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with OTP

### Notes Routes (`/api/notes`)
- `GET /` - Get all user notes
- `POST /create` - Create new note
- `GET /:id` - Get specific note
- `PUT /:id` - Update note
- `DELETE /:id` - Delete note
- `PUT /:id/pin` - Pin/unpin note
- `PUT /:id/archive` - Archive/unarchive note
- `GET /search` - Search notes

### AI Features
- **Automatic Summary Generation**: AI generates summaries for notes
- **Keyword Extraction**: Extract relevant keywords from content
- **Conversational AI**: Chat interface for note-related queries

For detailed API documentation, see [`Apis.md`](./Apis.md).

## 📁 Project Structure

```
IntelliNotes/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── notesController.js # Notes management logic
│   ├── middlewares/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User data model
│   │   ├── Notes.js           # Notes data model
│   │   └── Conversation.js    # AI conversation model
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   └── notesRoutes.js     # Notes routes
│   ├── services/
│   │   ├── aiServices.js      # AI integration services
│   │   └── mailSender.js      # Email service
│   ├── utils/                 # Utility functions
│   ├── package.json           # Dependencies and scripts
│   └── server.js              # Application entry point
├── Apis.md                    # Comprehensive API documentation
└── README.md                  # This file
```

## 🚀 Available Scripts

In the `backend` directory, you can run:

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
- `npm test` - Run the test suite (to be implemented)

## 🌟 Key Features Breakdown

### 🧠 AI Integration
- **Google Gemini AI**: Leverages advanced AI for content enhancement
- **Smart Summaries**: Automatically generates concise note summaries
- **Keyword Extraction**: Identifies relevant keywords from note content
- **Conversational Interface**: AI-powered chat for note interactions

### 📝 Note Management
- **Rich Content**: Support for various content types
- **Organization**: Tags, pinning, and archiving system
- **Search**: Advanced search with AI-enhanced relevance
- **User-Friendly**: Intuitive interface for seamless note-taking

### 🔒 Security
- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: Bcrypt for secure password handling
- **Email Verification**: OTP-based account verification
- **CORS Protection**: Configured for secure cross-origin requests

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Amarnath Garai**
- GitHub: [@Amarnath-18](https://github.com/Amarnath-18)
- Email: [Contact](mailto:amarnathgarai2004@gmail.com)

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for powerful AI capabilities
- [Express.js](https://expressjs.com/) for the robust backend framework
- [MongoDB](https://mongodb.com/) for flexible data storage
- [Node.js](https://nodejs.org/) community for excellent ecosystem

---

<div align="center">
  <p>⭐ Star this repository if you find it helpful!</p>
  <p>Made with ❤️ by <a href="https://github.com/Amarnath-18">Amarnath Garai</a></p>
</div>