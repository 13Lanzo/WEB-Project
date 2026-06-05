const mongoose = require('mongoose');
const User = require('../models/User');
const Message = require('../models/Message');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateObjectId = (id, campo) => {
    if (!id) throw { status: 400, message: `${campo} mancante.` };
    if (!isValidObjectId(id)) throw { status: 400, message: `${campo} non è un ObjectId valido: ${id}` };
    return id;
};

// INVIA MESSAGGIO
async function createMessage(req, res) {
    try {
        const { destinatarioId, testo } = req.body;

        if (!testo || !destinatarioId) {
            return res.status(400).json({
                errore: 'Il testo e il destinatario (ID) sono obbligatori.'
            });
        }

        try {
            validateObjectId(destinatarioId, 'destinatarioId');
        } catch (erroreVal) {
            return res.status(erroreVal.status || 400).json({ errore: erroreVal.message });
        }

        const mittenteObjectId = req.user.id;

        // Verifica che il destinatario esista
        const destinatario = await User.findById(destinatarioId);
        if (!destinatario) {
            return res.status(404).json({ errore: 'Destinatario non trovato.' });
        }

        const nuovoMessaggio = new Message({
            mittente: mittenteObjectId,
            destinatario: destinatarioId,
            testo
        });

        const messaggioSalvato = await nuovoMessaggio.save();
        const messaggioPopolato = await messaggioSalvato.populate('mittente destinatario', 'nome cognome email');

        res.status(201).json({
            success: true,
            dati: messaggioPopolato
        });

    } catch (errore) {
        console.error("Errore nel salvataggio del messaggio:", errore.message);
        res.status(500).json({ errore: "Impossibile inviare il messaggio." });
    }
}

// STORICO MESSAGGI CON UN UTENTE SPECIFICO
async function getMessages(req, res) {
    try {
        const mioId = req.user.id;
        const conChiId = req.params.conChiId;

        try {
            validateObjectId(mioId, 'mioId');
            validateObjectId(conChiId, 'conChiId');
        } catch (erroreVal) {
            return res.status(erroreVal.status || 400).json({ errore: erroreVal.message });
        }

        const storicoChat = await Message.find({
            $or: [
                { mittente: mioId, destinatario: conChiId },
                { mittente: conChiId, destinatario: mioId }
            ]
        })
        .sort({ createdAt: 1 })
        .populate('mittente destinatario', 'nome cognome');

        res.status(200).json(storicoChat);

    } catch (errore) {
        console.error("Errore nel recupero della chat:", errore.message);
        res.status(500).json({ error: "Errore nel caricamento della cronologia messaggi." });
    }
}

// LISTA CONVERSAZIONI — mostra solo chi ha scritto o ricevuto messaggi dall'utente loggato
async function getConversations(req, res) {
    try {
        const mioId = new mongoose.Types.ObjectId(req.user.id);

        // Trova tutti i messaggi in cui sono coinvolto
        const messaggi = await Message.find({
            $or: [{ mittente: mioId }, { destinatario: mioId }]
        })
        .sort({ createdAt: -1 })
        .populate('mittente', 'nome cognome email')
        .populate('destinatario', 'nome cognome email');

        // Raccoglie gli interlocutori unici con l'ultimo messaggio
        const interlocutoriMap = {};
        messaggi.forEach(msg => {
            const altroUtente = msg.mittente._id.toString() === req.user.id
                ? msg.destinatario
                : msg.mittente;

            const uid = altroUtente._id.toString();
            if (!interlocutoriMap[uid]) {
                interlocutoriMap[uid] = {
                    utente: altroUtente,
                    ultimoMessaggio: msg.testo,
                    ultimoOrario: msg.createdAt,
                    nonLetti: 0
                };
            }
        });

        // Conta i non letti per ogni interlocutore
        for (const uid of Object.keys(interlocutoriMap)) {
            const count = await Message.countDocuments({
                mittente: uid,
                destinatario: mioId,
                letto: false
            });
            interlocutoriMap[uid].nonLetti = count;
        }

        res.status(200).json({
            success: true,
            dati: Object.values(interlocutoriMap)
        });

    } catch (errore) {
        console.error("Errore nel recupero delle conversazioni:", errore.message);
        res.status(500).json({ errore: "Errore nel caricamento delle conversazioni." });
    }
}

// MESSAGGI NON LETTI — per le notifiche nella campana
async function getUnread(req, res) {
    try {
        const mioId = req.user.id;

        const nonLetti = await Message.find({
            destinatario: mioId,
            letto: false
        })
        .populate('mittente', 'nome cognome email')
        .sort({ createdAt: -1 });

        // Raggruppa per mittente per evitare duplicati
        const mittenteMap = {};
        nonLetti.forEach(msg => {
            const uid = msg.mittente._id.toString();
            if (!mittenteMap[uid]) {
                mittenteMap[uid] = {
                    mittente: msg.mittente,
                    ultimoMessaggio: msg.testo,
                    ultimoOrario: msg.createdAt,
                    count: 0
                };
            }
            mittenteMap[uid].count++;
        });

        res.status(200).json({
            success: true,
            dati: Object.values(mittenteMap),
            totalCount: nonLetti.length
        });

    } catch (errore) {
        console.error("Errore nel recupero dei messaggi non letti:", errore.message);
        res.status(500).json({ errore: "Errore nel caricamento delle notifiche." });
    }
}

// SEGNA MESSAGGI COME LETTI
async function updateMessage(req, res) {
    try {
        const mioId = req.user.id;
        const mittenteId = req.params.mittenteId;

        try {
            validateObjectId(mioId, 'mioId');
            validateObjectId(mittenteId, 'mittenteId');
        } catch (erroreVal) {
            return res.status(erroreVal.status || 400).json({ errore: erroreVal.message });
        }

        const risultato = await Message.updateMany(
            { mittente: mittenteId, destinatario: mioId, letto: false },
            { $set: { letto: true } }
        );

        res.status(200).json({
            messaggio: "Messaggi segnati come letti con successo.",
            messaggiAggiornati: risultato.modifiedCount
        });

    } catch (errore) {
        console.error("Errore nell'aggiornamento dello stato di lettura:", errore.message);
        res.status(500).json({ errore: "Impossibile aggiornare lo stato di lettura." });
    }
}

// ELIMINA MESSAGGIO
async function deleteMessage(req, res) {
    try {
        const messaggioId = req.params.id;

        try {
            validateObjectId(messaggioId, 'id messaggio');
        } catch (erroreVal) {
            return res.status(erroreVal.status || 400).json({ errore: erroreVal.message });
        }

        const messaggio = await Message.findById(messaggioId);

        if (!messaggio) {
            return res.status(404).json({
                success: false,
                messaggio: "Impossibile eliminare: messaggio non trovato"
            });
        }

        if (messaggio.mittente.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                messaggio: "Non sei autorizzato a eliminare questo messaggio"
            });
        }

        await Message.findByIdAndDelete(messaggioId);

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
}

module.exports = {
    createMessage,
    getMessages,
    getConversations,
    getUnread,
    updateMessage,
    deleteMessage
};