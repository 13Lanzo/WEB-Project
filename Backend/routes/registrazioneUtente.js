//(La rotta Express per la registrazione)
// Questo file gestirà l'endpoint HTTP POST che il frontend React chiamerà per registrare un nuovo utente.

const express = require('express');
const router = express.Router();
const User = require('../models/User'); //importa il modello User per interagire con il DB

//Metodo POST per la registrazione di un nuovo utente

router.post('/', async (req, res) => {
    try {
        const {nome, email, password, eta, ruolo, tagPreferenze, bio} = req.body;

        //verifichiamo se l'utente esiste già
        const utenteEsistente = await User.findOne({email: req.body.email});
        if(utenteEsistente){
            return res.status(400).json({
                success: false,
                messaggio: "L'email è già registrata."
            });
        } 
        
        //creiamo un nuovo utente 

        const nuovoUtente = new User({nome, email, password, eta, ruolo, tagPreferenze, bio});
        await nuovoUtente.save();

        return res.status(201).json({
            success: true,
            messaggio: "Utente registrato con successo!",
            dati: nuovoUtente
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            messaggio: "Si è verificato un errore interno al server.",
            dettaglio: err.message
        });
    }
});

//metodo GET per ottenere tutte le informazioni di un utente
router.get('/', async (req, res) => {
    try{
        const utenti= await User.find();
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

//metodo UPDATE per modificare le informazioni di un utente

router.put('/:id', async (req, res) => {
    try {
        const utenteAggiornato = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!utenteAggiornato){
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

/*router.delete('/:id', async (req, res) => {
    try{
        const utenteEliminato = await User.findByIdAndDelete(req.params.id);
        if(!utenteEliminato){
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
});*/

module.exports = router;