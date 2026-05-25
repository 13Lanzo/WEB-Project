/* deve prevedere:
- CREATE di un nuovo messaggio (POST --> /messages)
- READ della cronologia chat tra due utenti (GET --> /messages/:userId)
- UPDATE per aggiornare lo stato di lettura (booleano) di un messaggio (PATCH --> /messages/:id/read)
- DELETE (opzionale) per eliminare un messaggio (DELETE --> /messages/:id)
*/
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware')

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateObjectId = (id, campo) => {
    if (!id) {
        throw { status: 400, message: `${campo} mancante.` };
    }
    if (!isValidObjectId(id)) {
        throw { status: 400, message: `${campo} non è un ObjectId valido: ${id}` };
    }
    return id;
};


// =========================================================================
// 1. CREATE: Salva un nuovo messaggio nel DB
// ROUTE: POST /api/messages
// (Questo endpoint verrà invocato spesso dal server per salvare i messaggi di Socket.IO)
// =========================================================================
/**
 * @openapi
 * /messages:
 *   post:
 *     summary: Salva un nuovo messaggio nella chat
 *     description: Registra la transazione del messaggio tra mittente e destinatario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mittente
 *               - destinatario
 *               - testo
 *             properties:
 *               mittente:
 *                 type: string
 *                 description: L'ID o il Nome dell'utente che invia
 *                 example: "6a12f544c411ee6d0a7b055f"
 *               destinatario:
 *                 type: string
 *                 description: L'ID o il Nome dell'utente che riceve
 *                 example: "6a12f623c411ee6d0a7b0560"
 *               testo:
 *                 type: string
 *                 example: "Ciao! La stanza è ancora disponibile?"
 *     responses:
 *       201:
 *         description: Messaggio inviato e salvato.
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { mittente, destinatario, destinatarioId, testo } = req.body;

        // Validazione semplice: preferiamo ricevere direttamente gli ObjectId
        if (!testo || (!destinatarioId && !destinatario)) {
            return res.status(400).json({
                errore: 'Il testo e il destinatario (ID o nome/email) sono obbligatori.' });
        }

        const resolveUserId = async (valore, ruoloCampo) => {
            if (!valore) {
                throw new Error(`Valore mancante per ${ruoloCampo}`);
            }

            if (mongoose.Types.ObjectId.isValid(valore)) {
                const user = await User.findById(valore);
                if (user) return user._id;
            }

            const user = await User.findOne({ nome: valore });
            if (user) return user._id;

            const userByEmail = await User.findOne({ email: valore.toLowerCase().trim() });
            if (userByEmail) return userByEmail._id;

            throw new Error(`Utente non trovato per ${ruoloCampo}: ${valore}`);
        };

        // Il mittente è ricavato in modo sicuro dall'utente autenticato (dal token)
        const mittenteObjectId = req.user.id;

        const destinatarioObjectId = destinatarioId || await resolveUserId(destinatario, 'destinatario');

        const nuovoMessaggio = new Message({
            mittente: mittenteObjectId,
            destinatario: destinatarioObjectId,
            testo
        });

        const messaggioSalvato = await nuovoMessaggio.save();

        // Popoliamo i dettagli essenziali dei profili per l'output frontend
        const messaggioPopolato = await messaggioSalvato
            .populate('mittente destinatario', 'nome email');

        res.status(201).json(messaggioPopolato);
    
    } catch (errore) {
        console.error("Errore nel salvataggio del messaggio:", errore.message);

        if (errore.message.startsWith('Utente non trovato per')) {
            return res.status(404).json({ errore: errore.message });
        }

        res.status(500).json({ errore: "Impossibile inviare il messaggio."});
    }
});

// =========================================================================
// 2. READ: Recupera la conversazione tra l'utente loggato e un altro utente
// ROUTE: GET /api/messages/conversazione/:conChiId
// =========================================================================
/**
 * @openapi
 * /messages/conversazione/{conChiId}:
 *   get:
 *     summary: Recupera la cronologia dei messaggi tra due utenti
 *     description: Estrae tutti i messaggi scambiati tra l'utente corrente (mioId) e l'interlocutore (conChiId).
 *     parameters:
 *       - in: path
 *         name: conChiId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dell'altro utente della chat
 *       - in: query
 *         name: mioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dell'utente attualmente loggato (necessario per i test)
 *     responses:
 *       200:
 *         description: Storico messaggi recuperato con successo.
 */
router.get('/conversazione/:conChiId', authMiddleware, async(req, res) => {
    try {
        // NOTA: In produzione, l'ID dell'utente loggato (mioId) si prenderà dal Token JWT (req.user.id)
        // Per i test iniziali su Thunder Client, passiamo temporaneamente il mioId nella query string (?mioId=...)
        const mioId = req.query.id;
        const conChiId = req.params.conChiId;

        try {
            validateObjectId(mioId, 'mioId');
            validateObjectId(conChiId, 'conChiId');
        } catch (erroreVal) {
            return res.status(erroreVal.status || 400).json({ errore: erroreVal.message });
        }

        // Vogliamo trovare i messaggi in cui:
        // (Io sono il mittente E l'altro è il destinatario) 
        // OPPURE (L'altro è il mittente E io sono il destinatario)
        const storicoChat = await Message.find({
            $or: [
                { mittente: mioId, destinatario: conChiId},
                { mittente: conChiId, destinatario: mioId}
            ]
        })
        .sort({ createdAt: 1}) // Ordinamento cronologico dal più vecchio al più recente
        .populate('mittente destinatario', 'nome');

        res.status(200).json(storicoChat)


    } catch (errore) {
        console.error("Errore nel recupero della chat:", errore.message);
        res.status(500).json({ error: "Errore nel caricamento della cronologia messaggi." });
    }
});


// =========================================================================
// 3. UPDATE: Segna come letti tutti i messaggi ricevuti in una conversazione
// ROUTE: PATCH /api/messages/leggi/:mittenteId
// =========================================================================

router.patch('/leggi/:mittenteId', authMiddleware, async (req, res) => {
    try{
        const mioId = req.body.id; // ID dell'utente che sta leggendo la chat
        const mittenteId = req.params.mittenteId; // ID di chi ha inviato i messaggi

        try {
            validateObjectId(mioId, 'mioId');
            validateObjectId(mittenteId, 'mittenteId');
        } catch (erroreVal) {
            return res.status(erroreVal.status || 400).json({ errore: erroreVal.message });
        }

        // Aggiorna in massa tutti i messaggi letti inviato dall'altro utente verso di me
        const risultato = await Message.updateMany(
            { mittente: mittenteId, destinatario: mioId, letto: false},
            { $set: { letto: true } }
        );

        res.status(200).json({
            messaggio: "Messaggi segnati come letti con successo.",
            messaggiAggiornati: risultato.modifiedCount
        });
    } catch (errore) {
        console.error("Errore nell'aggiornamento dello stato di lettura:", errore.message);
        res.status(500).json({ errore: "Impossibile aggiornare lo stato di lettura."});
    }
});

// =========================================================================
// 4. DELETE: Elimina un singolo messaggio tramite il suo ID
// ROUTE: DELETE /api/messages/:id
// =========================================================================
/**
 * @openapi
 * /messages/{id}:
 *   delete:
 *     summary: Elimina un singolo messaggio tramite il suo ID
 *     description: Rimuove permanentemente un messaggio inviato per errore dal database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del messaggio da eliminare
 *     responses:
 *       200:
 *         description: Messaggio eliminato.
 *       404:
 *         description: Messaggio non trovato.
 */
router.delete('/:id', authMiddleware, async(req, res) => {
    try {
        // Recuperiamo l'id del messaggio dai parametri dell'URL
        const messaggioId = req.params.id;

        try {
            validateObjectId(messaggioId, 'id messaggio');
        } catch (erroreVal) {
            return res.status(erroreVal.status || 400).json({ errore: erroreVal.message });
        }

        // Recuperiamo il messaggio per verificare chi lo ha inviato
        const messaggio = await
        Message.findById(messaggioId);
        // la delate avviene dopo la verifica che l'utente loggato abbia inviato il messaggio

        // Se il messaggio non esiste (o è stato già eliminato), rispondiamo con not found
        if (!messaggio){
            return res.status(404).json({
                success: false,
                messaggio: "Impossibile eliminare: messaggio non trovato"
            });
        }

        // Verifica che lutente loggato sia colui che ha inviato il messaggio
        if (messaggio.mittente.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                messaggio: "Non sei autorizzato a eliminare questo messaggio"
            });
        }

        // Esegui la cancellazione
        await Message.findByIdAndDelete(messaggioId);

        // Messaggio eliminato con successo
        return res.status(200).json({
            success: true,
            messaggio: "Messaggio eliminato con successo",
            idEliminato: messaggioId
        });
    } catch (errore) {
        console.error("Errore nella cancellazione del messaggio:", errore.message);
        return res.status(500).json({
            success: false,
            messaggio: "Errore interno al server durante la fase di cancellazione.",
            dettaglio: errore.message
        });
    }
});

module.exports = router;