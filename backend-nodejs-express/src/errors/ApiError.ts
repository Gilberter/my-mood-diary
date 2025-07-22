// Emotion Project/my-mood-diary/backend-nodejs-express/src/errors/ApiError.ts

/**
 * @class ApiError
 * @extends Error
 * @description Custom error class for API-specific errors.
 * Allows setting a specific HTTP status code for the response.
 */
class ApiError extends Error {
  statusCode: number;
  isOperational: boolean; // Indicates if the error is operational (e.g., bad input) vs. programming (e.g., bug)

  constructor(message: string, statusCode: number) {
    super(message); // Call the parent Error constructor
    this.statusCode = statusCode;
    this.isOperational = true; // Mark as operational error
    Error.captureStackTrace(this, this.constructor); // Capture stack trace
  }
}

export default ApiError;