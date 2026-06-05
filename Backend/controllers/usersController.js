const express = require('express');
const User = require('../models/User');

// Recupera tutti gli utenti (senza password)
async function getAllUsers(req, res) {
    try {
        const utenti = await User.find().select('-password');
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
}

// Recupera un utente per ID
async function getUserById(req, res) {
    try {
        const utente = await User.findById(req.params.id).select('-password');

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
}

// Cerca utenti per nome o email (usata nel form "chi vive qui" del /new)
async function searchUsers(req, res) {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                success: false,
                messaggio: "Inserisci almeno 2 caratteri per la ricerca."
            });
        }

        const regex = new RegExp(q.trim(), 'i');

        const utenti = await User.find({
            $or: [
                { nome: regex },
                { cognome: regex },
                { email: regex }
            ]
        }).select('nome cognome email ruolo facolta bio').limit(10);

        res.status(200).json({
            success: true,
            dati: utenti
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            messaggio: "Errore durante la ricerca utenti",
            dettaglio: err.message
        });
    }
}

// Aggiorna profilo utente
async function updateUser(req, res) {
    try {
        if (req.user.id !== req.params.id) {
            return res.status(403).json({
                success: false,
                messaggio: "Non sei autorizzato ad aggiornare il profilo"
            });
        }

        delete req.body.password;

        const utenteAggiornato = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');

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
}

// Elimina utente
async function deleteUser(req, res) {
    try {
        if (req.user.id !== req.params.id) {
            return res.status(403).json({
                success: false,
                messaggio: "Non sei autorizzato a eliminare il profilo di un altro utente."
            });
        }

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
}

module.exports = {
    getAllUsers,
    getUserById,
    searchUsers,
    updateUser,
    deleteUser
};