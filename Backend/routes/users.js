const express = require('express');
const router = express.Router();
const User = require('../models/User');
// const authMiddleware = require('../middleware/auth'); // Ti servirà per proteggere le rotte

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
router.get('/', async (req, res) => {
    try {
        const utenti = await User.find().select('-password'); //escludiamo la password dalla risposta
        res.status(200).json({
            success: true,
            dati: utenti
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            messaggio: "Si è verificato un errore interno al server",
            dettaglio: err.message
        });
    }
});

//metodo GET per ottenere tutte le informazioni di un utente

/**
 * @openapi
 * /users/{id}:
 *  get:
 *      summary: Recupera il profilo pubblico di un singolo utente
 *      description: Mostra i dettagli di uno studente o host tramite il suo ID per la pagina del profilo o il matchmaking.
 *      parameters:
 *          - in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *                  description: L'ID univoco (ObjectId) dell'utente
 *      responses:
 *          200:
 *              description: Profilo recuperato con successo.
 *          404:
 *              description: Utente non trovato.
 */
router.get('/:id', async (req, res) => {
    try {
        const utente = await User.findById(req.params.id).select('-password'); //escludiamo la password dalla risposta

        if (!utente) {
            return res.status(404).json({
                success: false,
                messaggio: "Utente non trovato"
            });
        }

        res.status(200).json({
            success: true,
            dati: utente
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            messaggio: "Si è verificato un errore interno al server",
            dettaglio: err.message
        });
    }
});



//metodo UPDATE per modificare le informazioni di un utente
/**
 * @openapi
 * /users/{id}:
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
 *       required: true
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
router.put('/:id', async (req, res) => {
    try {
        const utenteAggiornato = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!utenteAggiornato) {
            return res.status(404).json({
                success: false,
                messaggio: "Impossibile aggiornare l'utente"
            });
        }

        return res.status(200).json({
            success: true,
            messaggio: "Utente aggiornato con successo!",
            dati: utenteAggiornato
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            messaggio: "Si è verificato un errore interno al server",
            dettaglio: err.message
        });
    }
});

//metodo DELETE per eliminare un utente

router.delete('/:id', async (req, res) => {
    try {
        const utenteEliminato = await User.findByIdAndDelete(req.params.id);
        if (!utenteEliminato) {
            return res.status(404).json({
                success: false,
                messaggio: "Impossibile eliminare l'utente"
            });
        }

        return res.status(200).json({
            success: true,
            messaggio: "Utente eliminato con successo!"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            messaggio: "Si è verificato un errore interno al server",
            dettaglio: err.message
        });
    }
});

module.exports = router;