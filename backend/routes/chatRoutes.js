import express from 'express';
import {
    startConversation,
    getConversations,
    getMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    deleteConversation,
    markMessagesAsRead
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/start', protect, startConversation);
router.get('/', protect, getConversations);
router.delete('/:conversationId', protect, deleteConversation);
router.get('/:conversationId/messages', protect, getMessages);
router.put('/:conversationId/read', protect, markMessagesAsRead);
router.post('/message', protect, sendMessage);
router.put('/message/edit', protect, editMessage);
router.delete('/message/:messageId', protect, deleteMessage);

export default router;
