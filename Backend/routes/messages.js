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
router.post('/', async (req, res) => {
    try {
        const { mittente, destinatario, mittenteId, destinatarioId, testo } = req.body;

        // Validazione semplice: preferiamo ricevere direttamente gli ObjectId
        if (!testo || (!mittenteId && !mittente) || (!destinatarioId && !destinatario)) {
            return res.status(400).json({ errore: 'Tutti i campi sono obbligatori. Invia testo, mittenteId e destinatarioId; mittente/destinatario sono supportati solo come fallback.' });
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

        const mittenteObjectId = mittenteId || await resolveUserId(mittente, 'mittente');
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
router.get('/conversazione/:conChiId', async(req, res) => {
    try {
        // NOTA: In produzione, l'ID dell'utente loggato (mioId) si prenderà dal Token JWT (req.user.id)
        // Per i test iniziali su Thunder Client, passiamo temporaneamente il mioId nella query string (?mioId=...)
        const mioId = req.query.mioId;
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

router.patch('/leggi/:mittenteId', async (req, res) => {
    try{
        const mioId = req.body.mioId; // ID dell'utente che sta leggendo la chat
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
router.delete('/:id', async(req, res) => {
    try {
        // Recuperiamo l'id del messaggio dai parametri dell'URL
        const messaggioId = req.params.id;

        try {
            validateObjectId(messaggioId, 'id messaggio');
        } catch (erroreVal) {
            return res.status(erroreVal.status || 400).json({ errore: erroreVal.message });
        }

        // Cerchiamo il messaggio nel DB e lo eliminiamo in un unico passaggio
        const messaggioEliminato = await Message.findByIdAndDelete(messaggioId);

        // Se il messaggio non esiste (o è stato già eliminato), rispondiamo con not found
        if (!messaggioEliminato){
            return res.status(404).json({
                success: false,
                messaggio: "Impossibile eliminare: messaggio non trovato"
            });
        }

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
})

module.exports = router;