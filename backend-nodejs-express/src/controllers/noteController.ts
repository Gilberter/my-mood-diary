// Emotion Project/my-mood-diary/backend-nodejs-express/src/controllers/noteController.ts

import { Request, Response, NextFunction } from 'express';
import Note from '../models/Note'; // Import your Note model and interface
import ApiError from '../errors/ApiError'; // Import your custom error class
import { asyncHandler } from '../utils/asyncHandler'; // Import the asyncHandler utility
import { sendResponse } from '../utils/sendResponse';


// --- CRUD Operations for Notes ---


/**
 * @route GET /api/notes
 * @description Get all notes for a specific user.
 * @access Private (requires authentication, userId will come from auth middleware later)
 */
export const getNotes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // In a real app, userId would come from authenticated user (e.g., req.user.id)
  // For now, let's use a placeholder or assume it's passed in query for testing
  const userId = req.query.userId; 

  if (!userId) {
    return next(new ApiError('User ID is required to fetch notes.', 400));
  }

  const notes = await Note.find({ userId:userId }).sort({ date: -1 }); // Find notes by userId, sort by date descending
  if (!notes) {
    return next(new ApiError("Notes not found", 404));
  }
  sendResponse(res,200,notes,"Notes sent successfully",true)
});

/**
 * @route POST /api/notes
 * @description Create a new note.
 * @access Private
 */
export const createNote = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  
  const { title, content, mood, date, userId } = req.body;
  // Valid data from req.body
  if (!title || !content || !mood || !userId) {
    return next(new ApiError('Please include title, content, mood, and userId.', 400));
  }

  // Create note
  const newNote = await Note.create({
    title,
    content,
    mood,
    date, 
    userId,
  });
  // Response
  sendResponse(res,200,newNote,"Note created successfully",true)
});

export const updateNote = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const noteId = req.params.id;
  const { title, content, mood, date, userId } = req.body;
  const updateFields = { title, content, mood, date }; 
  if (!userId) {
    return next(new ApiError("User not found",400))
  }
  
  const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, userId: userId }, // Find query with ownership check
      updateFields,                  // Fields to update
      { new: true, runValidators: true } // Options: return new doc, run schema validators
    )
  if (!updatedNote) {
    return next(new ApiError("Note not updated successfully",400))
  }

  sendResponse(res,200,updatedNote,"Note uptated successfully", true)

})

export const deleteNote = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const noteId = req.params.id
  const userId = req.query.userId as string

  if (!userId || !noteId) {
    return res.status(400).json({ success: false, message: 'User ID is required in the request body.' }) 
  }
  const deletedNote = await Note.findByIdAndDelete({_id: noteId, userId})
 if (!deletedNote) {
    return next(new ApiError("Failed to deleted note",400))
 }
  sendResponse(res,200,null,"Note deleted sucessfully", true)
})
