const express = require('express');
const User = require('../models/User');
const mongoose = require('mongoose');
const Message = require('../models/Message');


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

//controllare gedione authMiddleware
async function createMessage(req, res) {
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
}

async function getMessages(req, res) {
try {
        // Leggiamo l'ID dal token JWT decodificato (req.user.id), o facciamo fallback sul parametro query "mioId"
        const mioId = req.user?.id || req.query.mioId;
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
}

async function updateMessage(req, res) {
    try{
        const mioId = req.user?.id || req.body.mioId || req.body.id; // ID dell'utente che sta leggendo la chat
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
}

async function deleteMessage(req, res) {
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
}

async function getConversations(req, res) {
    try {
        const mioId = req.user.id;
        
        // Trova tutti i messaggi in cui l'utente loggato è mittente o destinatario
        const messaggi = await Message.find({
            $or: [{ mittente: mioId }, { destinatario: mioId }]
        })
        .sort({ createdAt: -1 }) // Dal più recente al più vecchio
        .populate('mittente destinatario', 'nome cognome email');

        // Raggruppa per interlocutore
        const conversazioni = [];
        const visto = new Set();

        for (const msg of messaggi) {
            const interlocutore = msg.mittente && msg.mittente._id.toString() === mioId 
                ? msg.destinatario 
                : msg.mittente;

            if (!interlocutore) continue;
            
            const interlocutoreId = interlocutore._id.toString();
            if (!visto.has(interlocutoreId)) {
                visto.add(interlocutoreId);
                conversazioni.push({
                    id: interlocutoreId,
                    name: `${interlocutore.nome} ${interlocutore.cognome}`,
                    email: interlocutore.email,
                    lastMsg: msg.testo,
                    time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    letto: msg.letto
                });
            }
        }

        res.status(200).json(conversazioni);
    } catch (errore) {
        console.error("Errore nel caricamento delle conversazioni:", errore.message);
        res.status(500).json({ errore: "Errore nel caricamento delle conversazioni." });
    }
}

module.exports = {
    createMessage, 
    getMessages,
    updateMessage,
    deleteMessage,
    getConversations
}