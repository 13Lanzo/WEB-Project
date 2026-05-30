const express = require('express');
const User = require('../models/User');

async function getAllUsers(req, res) {
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
}

async function getUserById(req, res) {
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
} 

async function updateUser(req, res) {
    try {
        // Controllo prima se l'utente loggato sta aggiornando il proprio profilo
        if (req.user.id !== req.params.id) {
            return res.status(403).json({
                success: false,
                messaggio: "Non sei autorizzato ad aggiornare il profilo"
            });
        }

        // Escludiamo le password dall'aggiornamento generico del profilo
        delete req.body.password;

        const utenteAggiornato = await 
            User.findByIdAndUpdate(req.params.id, req.body, 
                { new:true, runValidators: true })
                .select('-password');

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

async function deleteUser(req, res) {
    try {
        // Controllo se l'utente loggato sta eliminando il proprio profilo
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
    updateUser,
    deleteUser
}