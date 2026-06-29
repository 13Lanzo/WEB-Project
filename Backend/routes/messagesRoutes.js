const express = require('express');
const router = express.Router();
const verificaToken = require('../middleware/authMiddleware');
const MessageController = require('../controllers/messageController');

//recupera la lista delle persone con cui parlavi
router.get('/conversations', verificaToken, MessageController.getConversations);

//recupera i messaggi non letti
router.get('/unread', verificaToken, MessageController.getUnread);

//recupera tutti i messaggi nella chat
router.get('/:conChiId', verificaToken, MessageController.getMessages);

//carica mex
router.post('/', verificaToken,MessageController.createMessage);

//segna come letti i messaggi ricevuti
router.patch('/read/:mittenteId',verificaToken,MessageController.updateMessage);

//elimina il messaggio
router.delete('/:messaggioId',verificaToken,MessageController.deleteMessage);

module.exports = router;