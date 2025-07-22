// Emotion Project/my-mood-diary/backend-nodejs-express/src/utils/asyncHandler.ts

import { Request, Response, NextFunction } from 'express';

// Define a type for an async Express route handler function
type AsyncHandlerFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;
// Return Promise<any>
/**
 * @function asyncHandler
 * @description A utility wrapper for asynchronous Express route handlers.
 * It catches any errors thrown by the async function and passes them to
 * Express's error-handling middleware, preventing unhandled promise rejections.
 * @param {AsyncHandlerFunction} fn - The asynchronous route handler function.
 * @returns {Function} A new function that wraps the original handler with error catching.
 */
export const asyncHandler = (fn: AsyncHandlerFunction) =>
  (req: Request, res: Response, next: NextFunction) => { // return this doesnt execute the fn immediately
    Promise.resolve(fn(req, res, next)).catch(next);
};
// This declares asyncHandler as an exported constant that is a function.
// Takes one argument fn function
