// This is where the Express app logic reside
// src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import noteRoutes from './routes/noteRoutes'; // Import your note routes
import { errorHandler } from './middleware/errorHandler'; // Import your error handler middleware
import authRoutes from './routes/authRoutes'
import cookieParser from "cookie-parser";


dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5001; // Use environment variable or default to 5001

//Connect to the database
connectDB()

// Middleware

const allowedOrigins = [
  'http://localhost:5173', // React dev
  'http://localhost:5000', // FastAPI dev
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true
}));

app.use(express.json()); // Body parser for JSON requests
app.use(cookieParser());

// --- API Routes ---
app.use('/api/notes', noteRoutes);
app.use('/api/auth', authRoutes)
//This means that any requests starting with /api/notes will be handled by the route definitions within your noteRoutes file.
// t will respond to POST /api/notes. If it defines router.get('/:id'), it will respond to GET /api/notes/:id.
app.get('/', (req, res) => {
  res.send('Hello from the Node.js Express TypeScript Backend!');
});

app.use(errorHandler);
// Crucially, it is placed after all your other routes and middleware.

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});