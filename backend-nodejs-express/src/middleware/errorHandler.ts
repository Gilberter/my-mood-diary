// Emotion Project/my-mood-diary/backend-nodejs-express/src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import ApiError from '../errors/ApiError'; // Import your custom error class

/**
 * @function errorHandler
 * @description Centralized error handling middleware for Express.
 * This middleware catches errors passed via `next(err)` or thrown in async handlers.
 * It sends a standardized JSON error response to the client.
 * @param {any} err - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function (not typically called here for errors).
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction // 'next' is required even if not used, to identify it as error middleware
) => {
  // Log the error for debugging purposes (never expose stack traces in production)
  console.error(err);

  // Determine the status code and message
  let statusCode = err instanceof ApiError ? err.statusCode : 500;
  let message = err instanceof ApiError ? err.message : 'An unexpected error occurred.';

  // For unhandled errors (e.g., programming errors), use a generic message in production
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    statusCode = 500;
    message = 'An unexpected error occurred.';
  }

  // Send the standardized JSON error response
  res.status(statusCode).json({
    success: false,
    message: message,
    // Only send stack trace in development for debugging
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};