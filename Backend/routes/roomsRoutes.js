const express = require('express');
const router = express.Router();
const verificaToken = require('../middleware/authMiddleware');
const soloProprietario = require('../middleware/roleMiddleware');
const RoomsController = require('../controllers/roomsController');

// GET /api/rooms — Tutte le stanze disponibili (pubblico, con filtri)
router.get('/', RoomsController.getStanze);

// GET /api/rooms/mine — Solo le stanze del proprietario loggato
router.get('/mine', verificaToken, soloProprietario, RoomsController.getMyStanze);

// GET /api/rooms/my-room — La stanza dell'inquilino loggato (se assegnata)
router.get('/my-room', verificaToken, RoomsController.getMyRoom);

// GET /api/rooms/:id — Dettaglio singola stanza
router.get('/:id', RoomsController.getStanza);

// POST /api/rooms — Crea annuncio (solo proprietari)
router.post('/', verificaToken, soloProprietario, RoomsController.createStanza);

// PUT /api/rooms/:id — Modifica annuncio (solo il proprietario della stanza)
router.put('/:id', verificaToken, soloProprietario, RoomsController.updateStanza);

// DELETE /api/rooms/:id — Elimina annuncio (solo il proprietario della stanza)
router.delete('/:id', verificaToken, soloProprietario, RoomsController.deleteStanza);

module.exports = router;