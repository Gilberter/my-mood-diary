import { Router } from "express";
import { getNotes,createNote,updateNote,deleteNote } from "../controllers/noteController";

const router = Router()
// Define routes and link them to controller functions
// Note: In a real app, middleware for authentication (e.g., `protect`) would go here
// router.route('/').get(protect, getNotes).post(protect, createNote);
// router.route('/:id').get(protect, getNoteById).put(protect, updateNote).delete(protect, deleteNote);

// For learning purposes, without authentication middleware yet:
router.get('/', getNotes); // GET all notes (requires userId query param for now)
router.post('/', createNote); // POST a new note (requires userId in body for now)
router.put('/:id', updateNote) // PUT (update a note)
router.delete('/:id', deleteNote)

export default router;