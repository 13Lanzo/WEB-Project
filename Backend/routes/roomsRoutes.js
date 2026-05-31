const express = require('express');
const router = express.Router();
const verificaToken = require('../middleware/authMiddleware');
const RoomsController = require('../controllers/roomsController');

// 1. CREA ANNUNCIO STANZA (CREATE) -> POST /api/rooms
router.post('/:id/rooms', verificaToken, RoomsController.createStanza);

// 2. RECUPERA TUTTI GLI ANNUNCI (READ) -> GET / (Bacheca con filtri filtri prezzo/città)

router.get('/rooms', RoomsController.getStanze);

// 3. DETTAGLIO singola STANZA SINGOLA (READ) -> GET /api/rooms/:id (Usa .populate('creatoDa'))
router.get('/:id/rooms/:stanzaId', verificaToken, RoomsController.getStanza);


// 4. MODIFICA ANNUNCIO (UPDATE) -> PUT /api/rooms/:id
router.put('/:id/rooms/:stanzaId', verificaToken, RoomsController.updateStanza);

// 5. CANCELLA ANNUNCIO (DELETE) -> DELETE /api/rooms/:id
router.delete('/:id/rooms/:stanzaId', verificaToken, RoomsController.deleteStanza);

module.exports = router;