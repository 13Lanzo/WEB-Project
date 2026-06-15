/* deve prevedere:
- CREATE di un nuovo messaggio (POST --> /messages)
- READ della cronologia chat tra due utenti (GET --> /messages/:userId)
- UPDATE per aggiornare lo stato di lettura (booleano) di un messaggio (PATCH --> /messages/:id/read)
- DELETE (opzionale) per eliminare un messaggio (DELETE --> /messages/:id)
*/
const express = require('express');
const router = express.Router();
const verificaToken = require('../middleware/authMiddleware');
const MessageController = require('../controllers/messageController');

// 1. CREATE: Salva un nuovo messaggio nel DB
router.post('/:id/messages', verificaToken, MessageController.createMessage);

// 2. READ: Recupera la conversazione tra l'utente loggato e un altro utente
router.get('/:id/messages/:conChiId', verificaToken, MessageController.getMessages);

// 3. UPDATE: Segna come letti tutti i messaggi ricevuti in una conversazione
router.patch('/:id/messages/:mittenteId', verificaToken, MessageController.updateMessage);

// 4. DELETE: Elimina un singolo messaggio tramite il suo ID
router.delete('/:id/messages/:messaggioId', verificaToken, MessageController.deleteMessage);

module.exports = router;