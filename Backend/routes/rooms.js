const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// 1. CREA ANNUNCIO STANZA (CREATE) -> POST /api/rooms
router.post('/', async (req, res) => { /* ... */ });

// 2. RECUPERA TUTTI GLI ANNUNCI (READ) -> GET /api/rooms (Bacheca con filtri filtri prezzo/città)
router.get('/', async (req, res) => { /* ... */ });

// 3. DETTAGLIO STANZA SINGOLA (READ) -> GET /api/rooms/:id (Usa .populate('creatoDa'))
router.get('/:id', async (req, res) => { /* ... */ });

// 4. MODIFICA ANNUNCIO (UPDATE) -> PUT /api/rooms/:id
router.put('/:id', async (req, res) => { /* ... */ });

// 5. CANCELLA ANNUNCIO (DELETE) -> DELETE /api/rooms/:id
router.delete('/:id', async (req, res) => { /* ... */ });

module.exports = router;