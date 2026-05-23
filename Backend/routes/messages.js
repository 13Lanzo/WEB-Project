const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// 1. RECUPERA STORICO CHAT (READ) -> GET /api/messages/:userId (Chat cronologica tra due utenti)
router.get('/:userId', async (req, res) => { /* ... */ });

// 2. SEGNA COME LETTO (UPDATE) -> PATCH /api/messages/:id/read
router.patch('/:id/read', async (req, res) => { /* ... */ });

module.exports = router;