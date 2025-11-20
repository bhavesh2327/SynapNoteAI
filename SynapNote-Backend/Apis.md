# SynapNote API Documentation

A comprehensive API documentation for SynapNote - an intelligent note-taking application with AI-powered features.

## Table of Contents
- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Authentication APIs](#authentication-apis)
  - [Notes APIs](#notes-apis)
  - [AI Chat APIs](#ai-chat-apis)
- [Response Format](#response-format)
- [Error Handling](#error-handling)

## Overview

SynapNote is an intelligent note-taking application that leverages AI to enhance note creation, management, and interaction. The API provides endpoints for user authentication, note management, AI-powered content generation, and conversational AI features.

## Base URL

```
http://localhost:PORT/api
```

Replace `PORT` with your server port (check your environment variables).

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the request header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication APIs

All authentication endpoints are prefixed with `/api/auth`

#### 1. Sign Up
**POST** `/api/auth/signup`

Create a new user account and send OTP for verification.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully"
}
```

#### 2. Verify OTP
**POST** `/api/auth/verifyotp`

Verify the OTP sent to user's email during signup.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User verified successfully"
}
```

#### 3. Sign In
**POST** `/api/auth/signin`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### 4. Get Current User
**GET** `/api/auth/me`

Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### 5. Forgot Password
**POST** `/api/auth/forgotpassword`

Send password reset link to user's email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

#### 6. Reset Password
**POST** `/api/auth/resetpassword`

Reset user password using reset token.

**Request Body:**
```json
{
  "resetPasswordToken": "token-from-email",
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### Notes APIs

All notes endpoints are prefixed with `/api/notes` and require authentication.

#### 1. Create Note
**POST** `/api/notes/`

Create a new note with AI-generated keywords and summary.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "title": "My Note Title",
  "content": "This is the content of my note...",
  "tags": ["work", "project", "ideas"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note created successfully",
  "note": {
    "id": "note-id",
    "title": "My Note Title",
    "content": "This is the content of my note...",
    "tags": ["work", "project", "ideas"],
    "keywords": ["generated", "keywords"],
    "summary": "AI-generated summary",
    "createdAt": "2025-08-23T12:00:00Z",
    "updatedAt": "2025-08-23T12:00:00Z"
  }
}
```

#### 2. Get All Notes
**GET** `/api/notes/`

Retrieve all notes for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Notes fetched successfully",
  "notes": [
    {
      "id": "note-id",
      "title": "Note Title",
      "content": "Note content...",
      "tags": ["tag1", "tag2"],
      "keywords": ["keyword1", "keyword2"],
      "summary": "Note summary",
      "createdAt": "2025-08-23T12:00:00Z",
      "updatedAt": "2025-08-23T12:00:00Z"
    }
  ]
}
```

#### 3. Get Single Note
**GET** `/api/notes/:id`

Retrieve a specific note by ID.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Note fetched successfully",
  "note": {
    "id": "note-id",
    "title": "Note Title",
    "content": "Note content...",
    "tags": ["tag1", "tag2"],
    "keywords": ["keyword1", "keyword2"],
    "summary": "Note summary",
    "createdAt": "2025-08-23T12:00:00Z",
    "updatedAt": "2025-08-23T12:00:00Z"
  }
}
```

#### 4. Update Note
**PUT** `/api/notes/:id`

Update an existing note.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "title": "Updated Note Title",
  "content": "Updated content...",
  "tags": ["updated", "tags"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note updated successfully",
  "note": {
    "id": "note-id",
    "title": "Updated Note Title",
    "content": "Updated content...",
    "tags": ["updated", "tags"],
    "keywords": ["updated", "keywords"],
    "summary": "Updated summary",
    "updatedAt": "2025-08-23T12:30:00Z"
  }
}
```

#### 5. Delete Note
**DELETE** `/api/notes/:id`

Delete a note by ID.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Note deleted successfully",
  "note": {
    "id": "deleted-note-id"
  }
}
```

#### 6. Search Notes
**GET** `/api/notes/search?query=searchterm`

Search notes by title, tags, or keywords.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `query` (required): Search term (minimum 3 characters)

**Response:**
```json
{
  "success": true,
  "message": "Notes fetched successfully",
  "notes": [
    {
      "id": "note-id",
      "title": "Matching Note",
      "content": "Content with search term...",
      "tags": ["matching", "tags"],
      "createdAt": "2025-08-23T12:00:00Z"
    }
  ]
}
```

#### 7. Get Notes by Tag
**GET** `/api/notes/tags/:tag`

Retrieve all notes with a specific tag.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Notes fetched successfully",
  "notes": [
    {
      "id": "note-id",
      "title": "Tagged Note",
      "tags": ["specified-tag", "other-tags"],
      "createdAt": "2025-08-23T12:00:00Z"
    }
  ]
}
```

### AI-Powered APIs

#### 8. Generate Title
**POST** `/api/notes/gen-title/:id`

Generate AI-powered title suggestions for a note.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Title generated successfully",
  "title": "AI-Generated Title Based on Content"
}
```

#### 9. Generate Content
**POST** `/api/notes/gen-content`

Generate AI content based on a topic.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "topic": "Machine Learning Basics"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Content generated successfully",
  "content": "AI-generated content about the topic..."
}
```

#### 10. Improve Content
**POST** `/api/notes/improve-content`

Improve existing content using AI.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "content": "Original content to be improved..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Content improved successfully",
  "content": "AI-improved version of the content..."
}
```

### AI Chat APIs

#### 11. Chat with Note
**POST** `/api/notes/:id/chat`

Start a conversation with AI about a specific note.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "message": "What are the main points in this note?",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "success": true,
  "response": "AI response about the note content...",
  "sessionId": "session-id-for-conversation",
  "conversationId": "conversation-id"
}
```

#### 12. Get Conversation History
**GET** `/api/notes/:id/conversations?sessionId=session-id`

Retrieve conversation history for a note.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `sessionId` (optional): Specific session to retrieve

**Response:**
```json
{
  "success": true,
  "conversations": [
    {
      "id": "conversation-id",
      "sessionId": "session-id",
      "messages": [
        {
          "role": "user",
          "content": "User message",
          "timestamp": "2025-08-23T12:00:00Z"
        },
        {
          "role": "assistant",
          "content": "AI response",
          "timestamp": "2025-08-23T12:00:30Z"
        }
      ]
    }
  ]
}
```

#### 13. Clear Conversation
**PUT** `/api/notes/conversations/:sessionId/clear`

Mark a conversation as inactive (clear conversation).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Conversation cleared successfully"
}
```

#### 14. Delete Conversation
**DELETE** `/api/notes/conversations/:sessionId`

Permanently delete a conversation.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Conversation deleted successfully"
}
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": "Response data (varies by endpoint)"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Error Handling

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required or invalid token
- **403 Forbidden**: Access denied (e.g., unverified user)
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Common Error Scenarios

1. **Missing Authentication**
   - Status: 401
   - Message: "Authorization token required"

2. **Invalid Token**
   - Status: 401
   - Message: "Invalid or expired token"

3. **Unverified User**
   - Status: 403
   - Message: "User is not verified"

4. **Validation Errors**
   - Status: 400
   - Message: "Please fill all the fields" or specific validation error

5. **Resource Not Found**
   - Status: 404
   - Message: "Note not found" or "User doesn't exist"

## Environment Variables

Make sure to set up the following environment variables:

```env
PORT=5000
JWT_SECRET=your-jwt-secret
MONGODB_URI=your-mongodb-connection-string
EMAIL_SERVICE_CONFIG=your-email-service-config
AI_SERVICE_API_KEY=your-ai-service-api-key
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start the server: `npm start`
5. The API will be available at `http://localhost:PORT`

## Features

- **User Authentication**: Complete signup, signin, verification, and password reset flow
- **Note Management**: CRUD operations for notes with AI-enhanced features
- **AI Integration**: 
  - Automatic keyword and summary generation
  - Content improvement suggestions
  - Title generation
  - Content generation from topics
- **Conversational AI**: Chat with your notes using AI
- **Search & Filter**: Advanced search and tag-based filtering
- **Security**: JWT-based authentication with proper validation

## Support

For any issues or questions regarding the API, please check the error responses and ensure all required fields are provided in the request body and headers.
