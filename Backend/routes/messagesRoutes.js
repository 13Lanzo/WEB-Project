const express = require('express');
const router = express.Router();
const verificaToken = require('../middleware/authMiddleware');
const MessageController = require('../controllers/messageController');

// POST /api/messages — Invia messaggio
router.post('/', verificaToken, MessageController.createMessage);

// GET /api/messages/conversations — Lista conversazioni dell'utente loggato
router.get('/conversations', verificaToken, MessageController.getConversations);

// GET /api/messages/unread — Messaggi non letti (per le notifiche)
router.get('/unread', verificaToken, MessageController.getUnread);

// GET /api/messages/:conChiId — Storico chat con un utente specifico
router.get('/:conChiId', verificaToken, MessageController.getMessages);

// PATCH /api/messages/read/:mittenteId — Segna come letti i messaggi di un mittente
router.patch('/read/:mittenteId', verificaToken, MessageController.updateMessage);

// DELETE /api/messages/:id — Elimina un messaggio
router.delete('/:id', verificaToken, MessageController.deleteMessage);

module.exports = router;