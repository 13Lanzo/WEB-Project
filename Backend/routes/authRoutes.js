const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

//Metodo POST per la registrazione di un nuovo utente
router.post('/register', AuthController.register);
 
//Metodo POST per il login di un nuovo utente
router.post('/login', AuthController.login);

module.exports = router;