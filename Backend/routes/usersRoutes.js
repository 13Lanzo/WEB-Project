const express = require('express');
const router = express.Router();

// Ti servirà per proteggere le rotte
const verificaToken = require('../middleware/authMiddleware');
const UserController = require('../controllers/usersController');

//metodo GET per ottenere tutte le informazioni di tutti utenti
router.get('/users', UserController.getAllUsers);

//cerca utente
router.get('/search', verificaToken, UserController.searchUsers);

//metodo GET per ottenere tutte le informazioni di un utente
router.get('/:id/user', verificaToken, UserController.getUserById);

//metodo UPDATE per modificare le informazioni di un utente
router.put('/:id/user', verificaToken, UserController.updateUser);

//metodo DELETE per eliminare un utente
router.delete('/:id/user', verificaToken, UserController.deleteUser);

module.exports = router;