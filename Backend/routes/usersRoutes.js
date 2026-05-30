const express = require('express');
const router = express.Router();

// Ti servirà per proteggere le rotte
const verificaToken = require('../middleware/authMiddleware');
const UserController = require('../controllers/usersController');

//metodo GET per ottenere tutte le informazioni di tutti utenti

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Recupera la lista di tutti gli utenti
 *     description: Restituisce un array con tutti i profili degli utenti registrati.
 *     responses:
 *       200:
 *         description: Elenco degli utenti recuperato con successo.
 */
router.get('/users', UserController.getAllUsers);

//metodo GET per ottenere tutte le informazioni di un utente

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Recupera il profilo pubblico di un singolo utente
 *     description: Mostra i dettagli di uno studente o host tramite il suo ID per la pagina del profilo o il matchmaking.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID univoco (ObjectId) dell'utente
 *     responses:
 *       200:
 *         description: Profilo recuperato con successo.
 *       404:
 *         description: Utente non trovato.
 */
router.get('/:id/user', verificaToken, UserController.getUserById);



//metodo UPDATE per modificare le informazioni di un utente
/**
 * @openapi
 *   put:
 *     summary: Aggiorna i dati del profilo di un utente
 *     description: Permette di modificare la bio, l'età o l'array dei tag delle preferenze.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *                 example: "Studente Poliba. Amo l'automazione e cerco casa vicino a Via Re David."
 *               tagPreferenze:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["ordinato", "studio-notturno"]
 *     responses:
 *       200:
 *         description: Profilo aggiornato con successo.
 */
router.put('/:id/user', verificaToken, UserController.updateUser);

//metodo DELETE per eliminare un utente

router.delete('/:id/user', verificaToken, UserController.deleteUser);

module.exports = router;