//(La rotta Express per la registrazione)
// Questo file gestirà l'endpoint HTTP POST che il frontend React chiamerà per registrare un nuovo utente.

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Importa il modello User per interagire con la collezione "users" su MongoDB Atlas

// Rotta POST per la registrazione di un nuovo utente
router.post('/register', async (req, res) => {
    //logica di registrazione
    try {
        const { nome, email, password, eta, ruolo, tagPreferenze } = req.body;

        // Crea un nuovo utente
        const nuovoUtente = new User({
            nome,
            email,
            password,
            eta,
            ruolo,
            tagPreferenze
        });

        // Salva l'utente nel database
        await nuovoUtente.save();

        // Risposta di successo
        res.status(201).json({
            messaggio: "Utente registrato con successo.",
            utente: nuovoUtente
        });
    } catch (err) {
        console.error("Errore nella registrazione dell'utente:", err.message);
        res.status(500).json({
            err: "Si è verificato un errore interno al server.",
            dettaglio: err.message
        });
    }
});

module.exports = router;