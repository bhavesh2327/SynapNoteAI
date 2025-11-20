import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import {ConnectDB} from './config/db.js';
import userRoutes from './routes/authRoutes.js'
import notesRoutes from './routes/notesRoutes.js'

// Load .env from the project root (works even when starting from backend or project root)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const app = express();



// CORS configuration
app.use(cors({
  origin: [
    'https://intellinotes-new.vercel.app', // Production frontend
    'http://localhost:5173', // Development frontend
    process.env.FRONTEND_URL // Additional URL from env
  ], 
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


app.use('/api/auth' , userRoutes);
app.use('/api/notes' , notesRoutes);



const PORT = process.env.PORT || 5000;

// Start up: ensure DB connection before opening HTTP server
try {
  // top-level await is supported in ESM; wait for DB to connect first
  await ConnectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (err) {
  console.error('Failed to start server due to DB connection error:', err);
  process.exit(1);
}
