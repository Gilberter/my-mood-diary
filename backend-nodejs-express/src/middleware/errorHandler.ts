// Emotion Project/my-mood-diary/backend-nodejs-express/src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import ApiError from '../errors/ApiError'; // Import your custom error class
import { sendResponse } from '../utils/sendResponse';

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
  sendResponse(res,statusCode,null,message,false)
};