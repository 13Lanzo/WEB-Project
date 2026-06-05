const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const verificaToken = require('../middleware/authMiddleware');

// POST /api/auth/register — Registrazione
router.post('/register', AuthController.register);

// POST /api/auth/login — Login
router.post('/login', AuthController.login);

// GET /api/auth/me — Dati utente loggato (richiede token)
router.get('/me', verificaToken, AuthController.getMe);

module.exports = router;