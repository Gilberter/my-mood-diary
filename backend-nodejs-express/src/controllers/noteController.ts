// Emotion Project/my-mood-diary/backend-nodejs-express/src/controllers/noteController.ts

import { Request, Response, NextFunction } from 'express';
import Note from '../models/Note'; // Import your Note model and interface
import ApiError from '../errors/ApiError'; // Import your custom error class
import { asyncHandler } from '../utils/asyncHandler'; // Import the asyncHandler utility


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
  res.status(200).json({
    success: true,
    count: notes.length,
    data: notes,
  });
});

/**
 * @route GET /api/notes/:id
 * @description Get a single note by ID for a specific user.
 * @access Private
 */
export const getNoteById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { Noteid } = req.params;
  const id = req.query.id as string || 'test-user-id'; // Placeholder for userId

  if (!id) {
    return next(new ApiError('User ID is required to fetch a note.', 400));
  }

  const note = await Note.findOne({ _id: id, Noteid });

  if (!note) {
    return next(new ApiError(`Note not found with ID of ${id} for user ${Noteid}`, 404));
  }

  res.status(200).json({
    success: true,
    data: note,
  });
});

/**
 * @route POST /api/notes
 * @description Create a new note.
 * @access Private
 */
export const createNote = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { title, content, mood, date, userId } = req.body;

  if (!title || !content || !mood || !userId) {
    return next(new ApiError('Please include title, content, mood, and userId.', 400));
  }


  const newNote = await Note.create({
    title,
    content,
    mood,
    date, 
    userId,
  });

  res.status(201).json({
    success: true,
    data: newNote,
  });
});

export const updateNote = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const noteId = req.params.id;
  const { title, content, mood, date, userId } = req.body;
  const updateFields = { title, content, mood, date }; 
  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID is required in the request body.' }) 
  }
  

  const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, userId: userId }, // Find query with ownership check
      updateFields,                  // Fields to update
      { new: true, runValidators: true } // Options: return new doc, run schema validators
    )
  if (!updatedNote) {
    return next(new ApiError("Note not found",400))
  }


  try {
    res.status(200).json({
      success: true,
      data: updatedNote,
      message: 'Note updated successfully'
    })
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return next(new ApiError(`Validation failed during update: ${error.message}`, 400))
    }
    return next(new ApiError('Failed to update note due to a server error.', 500))
  }

})

export const deleteNote = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const noteId = req.params.id
  const userId = req.query.userId as string

  if (!userId || !noteId) {
    return res.status(400).json({ success: false, message: 'User ID is required in the request body.' }) 
  }
  await Note.findByIdAndDelete({_id: noteId, userId:userId})
  res.status(200).json({
    success: true,
    message: 'Note deleted successfully',
    data: null
  })
})
