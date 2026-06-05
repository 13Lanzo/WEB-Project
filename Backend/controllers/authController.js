const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTRAZIONE
async function register(req, res) {
    try {
        const { nome, cognome, email, password, eta, ruolo, facolta, tagPreferenze, bio } = req.body;

        // Verifica se l'utente esiste già
        const utenteEsistente = await User.findOne({ email });
        if (utenteEsistente) {
            return res.status(400).json({
                success: false,
                messaggio: "L'email è già registrata."
            });
        }

        // Creazione nuovo utente
        const nuovoUtente = new User({
            nome,
            cognome,
            email,
            password,
            eta,
            ruolo: ruolo || 'inquilino',
            facolta: ruolo === 'inquilino' ? (facolta || '') : '',
            tagPreferenze: tagPreferenze || [],
            bio: bio || ''
        });

        await nuovoUtente.save();

        // Generiamo subito il token dopo la registrazione
        const payload = { id: nuovoUtente._id, ruolo: nuovoUtente.ruolo };
        const jwtSecretKey = process.env.JWT_SECRET;
        const token = jwt.sign(payload, jwtSecretKey, { expiresIn: '24h' });

        return res.status(201).json({
            success: true,
            messaggio: "Utente registrato con successo!",
            token,
            utente: {
                id: nuovoUtente._id,
                nome: nuovoUtente.nome,
                cognome: nuovoUtente.cognome,
                email: nuovoUtente.email,
                ruolo: nuovoUtente.ruolo,
                facolta: nuovoUtente.facolta,
                bio: nuovoUtente.bio,
                tagPreferenze: nuovoUtente.tagPreferenze,
                eta: nuovoUtente.eta
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            messaggio: "Si è verificato un errore interno al server.",
            dettaglio: err.message
        });
    }
}

// LOGIN
async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Cerca l'utente nel DB
        const utente = await User.findOne({ email });
        if (!utente) {
            return res.status(401).json({
                success: false,
                messaggio: "Utente non trovato. Verifica l'email o la password!"
            });
        }

        // Verifica password
        const isMatch = await utente.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                messaggio: "Credenziali non valide. Verifica email e password!"
            });
        }

        // Crea JWT — IMPORTANTE: include il ruolo nel payload
        const payload = { id: utente._id, ruolo: utente.ruolo };
        const jwtSecretKey = process.env.JWT_SECRET;
        const token = jwt.sign(payload, jwtSecretKey, { expiresIn: '24h' });

        return res.status(200).json({
            success: true,
            messaggio: "Login effettuato con successo!",
            token,
            utente: {
                id: utente._id,
                nome: utente.nome,
                cognome: utente.cognome,
                email: utente.email,
                ruolo: utente.ruolo,
                facolta: utente.facolta,
                bio: utente.bio,
                tagPreferenze: utente.tagPreferenze,
                eta: utente.eta
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            messaggio: "Si è verificato un errore interno al server.",
            dettaglio: err.message
        });
    }
}

// GET ME — Recupera i dati dell'utente loggato dal token
async function getMe(req, res) {
    try {
        const utente = await User.findById(req.user.id).select('-password');
        if (!utente) {
            return res.status(404).json({
                success: false,
                messaggio: "Utente non trovato."
            });
        }
        return res.status(200).json({
            success: true,
            utente: {
                id: utente._id,
                nome: utente.nome,
                cognome: utente.cognome,
                email: utente.email,
                ruolo: utente.ruolo,
                facolta: utente.facolta,
                bio: utente.bio,
                tagPreferenze: utente.tagPreferenze,
                eta: utente.eta
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            messaggio: "Si è verificato un errore interno al server.",
            dettaglio: err.message
        });
    }
}

module.exports = {
    register,
    login,
    getMe
};