# SynapNote Frontend

<div align="center">

![SynapNote Logo](public/vite.svg)

**An AI-powered intelligent note-taking application built with React and modern web technologies**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC.svg)](https://tailwindcss.com/)

[Live Demo](https://your-deployment-url.vercel.app) • [Backend Repository](https://github.com/your-username/intellinotes-backend) • [Documentation](#documentation)

</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [Authentication Flow](#authentication-flow)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

SynapNote is a modern, intelligent note-taking application that leverages AI to enhance your productivity. Built with React and powered by advanced AI features, it offers seamless note management, smart search capabilities, and interactive AI chat functionality.

### Key Highlights

- 🤖 **AI-Powered Intelligence**: Automatic content generation, summaries, and smart suggestions
- 💬 **Interactive AI Chat**: Chat with your notes to discover insights and connections
- 🔍 **Smart Search**: Advanced search across content, tags, and keywords
- 📝 **Rich Text Editing**: Support for Markdown rendering and formatting
- 🔐 **Secure Authentication**: Complete auth flow with OTP verification and password recovery
- 📱 **Responsive Design**: Optimized for desktop and mobile devices
- ⚡ **Real-time Updates**: Instant synchronization across devices

## ✨ Features

### Core Features

- **Note Management**
  - Create, edit, and delete notes
  - Rich text editing with Markdown support
  - Real-time auto-save functionality
  - Note categorization and tagging

- **AI-Powered Capabilities**
  - Automatic content summarization
  - Smart keyword extraction
  - AI-assisted content generation
  - Conversational AI chat with notes

- **Advanced Search & Organization**
  - Full-text search across all notes
  - Filter by tags, categories, and dates
  - Smart suggestions and auto-complete
  - Bulk operations and management

### Authentication & Security

- **User Management**
  - Secure user registration and login
  - Email verification with OTP
  - Password reset functionality
  - Protected routes and session management

- **Security Features**
  - JWT token-based authentication
  - Automatic token refresh
  - Secure API communication
  - Route protection

### User Experience

- **Modern UI/UX**
  - Clean, intuitive interface
  - Smooth animations with Framer Motion
  - Toast notifications for user feedback
  - Loading states and error handling

- **Performance**
  - Code splitting and lazy loading
  - Optimized bundle size
  - Fast search and navigation
  - Offline capabilities (planned)

## 🛠 Tech Stack

### Frontend Framework
- **React 18.3.1** - Modern React with hooks and concurrent features
- **Vite 5.4.2** - Fast build tool and development server
- **React Router DOM 7.8.2** - Client-side routing

### Styling & UI
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Framer Motion 12.23.12** - Animation library
- **Lucide React 0.541.0** - Beautiful SVG icons

### State Management & API
- **React Context API** - Global state management
- **Axios 1.11.0** - HTTP client for API requests
- **React Hot Toast 2.6.0** - Toast notifications

### Content & Rendering
- **React Markdown 10.1.0** - Markdown rendering support

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS & Autoprefixer** - CSS processing
- **Vercel** - Deployment and hosting

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**
- **Git** for version control

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/intellinotes-frontend.git
   cd intellinotes-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application running.

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=SynapNote

# Optional: Analytics and Monitoring
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
VITE_SENTRY_DSN=your_sentry_dsn
```

### Environment Variables Explanation

- `VITE_API_URL`: Base URL for your backend API
- `VITE_APP_NAME`: Application name used in titles and metadata
- `VITE_GOOGLE_ANALYTICS_ID`: Google Analytics tracking ID (optional)
- `VITE_SENTRY_DSN`: Sentry error tracking DSN (optional)

## 📜 Scripts

```bash
# Development
npm run dev          # Start development server
npm run dev:host     # Start dev server with network access

# Building
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier

# Testing (if implemented)
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate test coverage report
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LoadingSpinner.jsx
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── context/            # React Context providers
│   ├── AuthContext.jsx
│   └── NotesContext.jsx
├── pages/              # Page components
│   ├── CreateNote.jsx
│   ├── Dashboard.jsx
│   ├── EditNote.jsx
│   ├── ForgotPassword.jsx
│   ├── Landing.jsx
│   ├── NoteDetail.jsx
│   ├── Notes.jsx
│   ├── ResetPassword.jsx
│   ├── SignIn.jsx
│   ├── SignUp.jsx
│   └── VerifyOTP.jsx
├── services/           # API services and utilities
│   └── api.js
├── assets/            # Static assets
│   └── react.svg
├── App.jsx            # Main application component
├── main.jsx          # Application entry point
└── index.css         # Global styles
```

### Directory Explanation

- **`components/`**: Reusable UI components used across multiple pages
- **`context/`**: React Context providers for global state management
- **`pages/`**: Individual page components corresponding to routes
- **`services/`**: API service functions and utilities
- **`assets/`**: Static assets like images, icons, etc.

## 🧩 Key Components

### Authentication Components

- **`AuthContext`**: Manages user authentication state and provides auth functions
- **`ProtectedRoute`**: HOC that protects routes requiring authentication
- **`SignIn/SignUp`**: User authentication forms
- **`VerifyOTP`**: OTP verification for email confirmation
- **`ForgotPassword/ResetPassword`**: Password recovery flow

### Note Management

- **`NotesContext`**: Manages notes state and CRUD operations
- **`Dashboard`**: Overview of user's notes and quick actions
- **`Notes`**: List view of all user notes with search and filters
- **`CreateNote/EditNote`**: Forms for creating and editing notes
- **`NoteDetail`**: Detailed view of individual notes

### UI Components

- **`Navbar`**: Navigation bar with user menu and search
- **`LoadingSpinner`**: Reusable loading indicator

## 🔐 Authentication Flow

The application implements a comprehensive authentication system:

1. **Registration**: User signs up with email and password
2. **Email Verification**: OTP sent to user's email for verification
3. **Login**: User signs in with verified credentials
4. **JWT Token**: Secure token-based authentication
5. **Protected Routes**: Certain routes require authentication
6. **Password Recovery**: Forgot password flow with email reset
7. **Auto-logout**: Automatic logout on token expiration

### Auth Context Features

- User state management
- Token storage and retrieval
- Automatic token refresh
- Login/logout functionality
- Registration and verification
- Password reset capabilities

## 🌐 API Integration

The application communicates with a backend API using Axios:

### API Service Features

- **Base Configuration**: Centralized API endpoint configuration
- **Request Interceptors**: Automatic token attachment to requests
- **Response Interceptors**: Global error handling and token refresh
- **Authentication APIs**: Login, register, verify, password reset
- **Notes APIs**: CRUD operations for notes
- **User APIs**: Profile management and user data

### API Structure

```javascript
// Authentication APIs
authAPI.login(credentials)
authAPI.register(userData)
authAPI.verifyOTP(otpData)
authAPI.forgotPassword(email)
authAPI.resetPassword(resetData)

// Notes APIs
notesAPI.getNotes()
notesAPI.createNote(noteData)
notesAPI.updateNote(id, noteData)
notesAPI.deleteNote(id)
notesAPI.getNoteById(id)

// User APIs
userAPI.getProfile()
userAPI.updateProfile(profileData)
```

## 🚀 Deployment

The application is configured for easy deployment on Vercel:

### Vercel Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

2. **Environment Variables**
   
   Set up environment variables in Vercel dashboard:
   - `VITE_API_URL`
   - `VITE_APP_NAME`

3. **Custom Domain** (Optional)
   
   Configure custom domain in Vercel settings.

### Alternative Deployment Options

- **Netlify**: Direct GitHub integration
- **AWS S3 + CloudFront**: Static hosting with CDN
- **GitHub Pages**: Free hosting for public repositories
- **Docker**: Containerized deployment

### Build Configuration

The application uses Vite's build configuration with:
- Code splitting for optimal loading
- Asset optimization
- Bundle analysis
- Production optimizations

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Lint code: `npm run lint`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Reporting Issues

- Use the GitHub issue tracker
- Provide detailed reproduction steps
- Include screenshots for UI issues
- Mention browser and OS information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide React](https://lucide.dev/) - Icon library

## 📞 Support

- 📧 Email: support@intellinotes.com
 - � Email: support@synapnote.com
- �🐛 Issues: [GitHub Issues](https://github.com/your-username/intellinotes-frontend/issues)
- 📖 Documentation: [Wiki](https://github.com/your-username/intellinotes-frontend/wiki)

---

<div align="center">
  Made with ❤️ by the SynapNote Team
</div>
