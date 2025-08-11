import { Request, Response, NextFunction } from 'express';
import Note from '../models/Note'; // Import your Note model and interface
import ApiError from '../errors/ApiError'; // Import your custom error class
import { asyncHandler } from '../utils/asyncHandler'; // Import the asyncHandler utility

export const getPrediction = asyncHandler(async (req:Request,res: Response, next:NextFunction) => {
    const text = req.query.textPredict
    
})