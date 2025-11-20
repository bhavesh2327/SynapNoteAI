import express from 'express';
import { 
    chatWithNote, 
    createNote, 
    deleteNote, 
    generateContent, 
    generateTitle, 
    getNote, 
    getNotes, 
    getNotesByTag, 
    improveContentController, 
    searchNotes, 
    updateNote,
    getConversationHistoryController,
    clearConversationController,
    deleteConversationController
} from '../controllers/notesController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// POST /api/notes - Create a new note (protected route)

router.post('/', auth, createNote);
router.get('/tags/:tag', auth, getNotesByTag);
router.get('/search', auth, searchNotes);
router.get('/', auth, getNotes);
router.get('/:id', auth, getNote);
router.delete('/:id', auth, deleteNote);
router.put('/:id', auth, updateNote);
router.post('/gen-title/:id' , auth , generateTitle);
router.post('/gen-content' , auth , generateContent);
router.post('/improve-content' , auth , improveContentController);

// Chat and conversation routes
router.post('/:id/chat', auth, chatWithNote);
router.get('/:id/conversations', auth, getConversationHistoryController);
router.put('/conversations/:sessionId/clear', auth, clearConversationController);
router.delete('/conversations/:sessionId', auth, deleteConversationController);


export default router;
