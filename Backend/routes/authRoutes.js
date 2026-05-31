/* routes/auth.js

// 1. REGISTRAZIONE UTENTE -> POST /api/auth/register
router.post('/register', async (req, res) => { ... });

// 2. LOGIN UTENTE -> POST /api/auth/login
router.post('/login', async (req, res) => { ... });

// 3. LOGOUT UTENTE -> POST /api/auth/logout
router.post('/logout', (req, res) => {
    // Se usi i cookie sicuri httpOnly per salvare il JWT, qui li cancelli:
    // res.clearCookie('token');
    
    res.status(200).json({ 
        messaggio: "Logout effettuato con successo. Sessione terminata." 
    });
});*/



//(La rotta Express per la registrazione)
// Questo file gestirà l'endpoint HTTP POST che il frontend React chiamerà per registrare un nuovo utente.

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

//Metodo POST per la registrazione di un nuovo utente
router.post('/register', AuthController.register);
 
router.post('/login', AuthController.login);

module.exports = router;