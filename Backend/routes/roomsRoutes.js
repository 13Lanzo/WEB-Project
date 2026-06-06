const express = require('express');
const router = express.Router();
const verificaToken = require('../middleware/authMiddleware');
const RoomsController = require('../controllers/roomsController');
const soloProprietario =require('../middleware/roleMiddleware');


// prendi tutti gli annunci delle stanza
router.get('/', RoomsController.getStanze);

// prendiamo solo le stanze del proprietario loggato
router.get('/mine',verificaToken, soloProprietario, RoomsController.getMyStanza);

// prendiamo i dettagli della singola stanza
router.get('/:id', verificaToken, RoomsController.getStanza);

// crea annuncio stanza solo se sei proprietario
router.post('/', verificaToken, soloProprietario, RoomsController.createStanza);

// modifica annuncio solo dai proprietari ????
router.put('/:id', verificaToken, soloProprietario, RoomsController.updateStanza);

// cancella annuncio
router.delete('/:id', verificaToken, soloProprietario, RoomsController.deleteStanza);

module.exports = router;