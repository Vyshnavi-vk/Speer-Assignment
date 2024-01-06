import express from 'express'
const router = express.Router()
import {
    createNote,
    fetchNotes,
    getNoteById,
    updateNode,
    deleteNote,
    shareNote,
    searchNote
} from '../controllers/noteController.js'
import { protect } from "../middlewares/authMiddleware.js"



router.post('/notes', protect, createNote)
router.get('/notes', protect, fetchNotes)
router.get('/notes/:id', protect, getNoteById)
router.put('/notes/:id', protect, updateNode)
router.delete('/notes/:id', protect, deleteNote)
router.post('/notes/:id/share', protect, shareNote)
router.get('/search=?', protect, searchNote)
export default router


// GET /api/notes: get a list of all notes for the authenticated user.
// GET /api/notes/:id: get a note by ID for the authenticated user.
// POST /api/notes: create a new note for the authenticated user.
// PUT /api/notes/:id: update an existing note by ID for the authenticated user.
// DELETE /api/notes/:id: delete a note by ID for the authenticated user.
// POST /api/notes/:id/share: share a note with another user for the authenticated user.
// GET /api/search?q=:query: search for notes based on keywords for the authenticated user.