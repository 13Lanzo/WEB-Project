const express = require('express');
const router = express.Router();
const verificaToken = require('../middleware/authMiddleware');
const UsersController = require('../controllers/usersController');

// GET /api/users — Tutti gli utenti
router.get('/', verificaToken, UsersController.getAllUsers);

// GET /api/users/search?q=... — Ricerca utenti per nome/email (per "chi vive qui" nel /new)
router.get('/search', verificaToken, UsersController.searchUsers);

// GET /api/users/:id — Utente per ID
router.get('/:id', verificaToken, UsersController.getUserById);

// PUT /api/users/:id — Aggiorna profilo (solo il proprio)
router.put('/:id', verificaToken, UsersController.updateUser);

// DELETE /api/users/:id — Elimina account (solo il proprio)
router.delete('/:id', verificaToken, UsersController.deleteUser);

module.exports = router;