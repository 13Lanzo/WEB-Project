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

async function searchUsers(req, res) {
    try{
        const{q}= req.query;
        if(!q){
            return res.status(400).json({
                success:false,
                messaggio: 'Parametro di ricerca mancante.'
            });
        }
        const regex =new RegExp(q,'i');
        const utentiTrovati= await User.find({
            ruolo: 'inquilino',
            $or: [
                {nome:{$regex: regex}},
                {cognome: {$regex: regex}},
                {email: {$regex: regex}}
            ]
        }).select('nome cognome email');
        return res.status(200).json({
            success:true,
            dati: utentiTrovati
        });
    } catch (error) {
        console.error('Errore nella ricerca utenti:', error.message);
        res.status(500).json({
            success:false,
            messaggio: 'Si è verificato un errore durante la ricerca.',
            dettaglio: error.message
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
        const {bio, tagPreferenze, facoltà}= req.body;
        const updateData={};
        if(bio!=undefined) updateData.bio=bio;
        if(tagPreferenze !== undefined) updateData.tagPreferenze=tagPreferenze;
        if(facolta!== undefined) updateData.facolta=facolta;
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
    searchUsers,
    deleteUser
}