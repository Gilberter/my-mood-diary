// This is where the Express app logic reside
// src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import noteRoutes from './routes/noteRoutes'; // Import your note routes
import { errorHandler } from './middleware/errorHandler'; // Import your error handler middleware
import authRoutes from './routes/authRoutes'

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5001; // Use environment variable or default to 5001

//Connect to the database
connectDB()

// Middleware
app.use(cors()); // Enable CORS for all origins in development
app.use(express.json()); // Body parser for JSON requests

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