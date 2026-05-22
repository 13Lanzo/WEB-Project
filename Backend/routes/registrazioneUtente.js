//(La rotta Express per la registrazione)
// Questo file gestirà l'endpoint HTTP POST che il frontend React chiamerà per registrare un nuovo utente.

const express = require('express');
const router = express.Router();
const User = require('../models/User');

//Metodo POST per la registrazione di un nuovo utente

router.post('/register', async(req,res) => {
    try{
        const { nome, email, password, eta, ruolo, tagPreferenze, bio } = req.body;

        //controllo se l'utente esiste già
        const utenteEsistente = await User.findOne({ email });
        if(utenteEsistente){
            return res.status(400).json({
                success: false,
                messaggio: "L'email è già registrata."
            })
        };
        //se dopo il controllo l'utente non risulta registrato, crea un nuovo utente
        const nuovoUtente = new User({
            nome, email, password, eta, ruolo, tagPreferenze, bio
        });
        await nuovoUtente.save();
        res.status(201).json({
            success: true,
            messaggio:"Utente registrato con successo!"
        });
    } catch(err){
        res.status(500).json({success:false, errore: err.message});
    }
});

//Metodo GET per ottenere tutte le informazioni di un utente

router.get('/utenti', async(req,res) => {
    try{
        //trovo gli utenti nel db
        const utenti = await User.find();
        res.status(200).json({
            success: true,
            dati: utenti
        });
    }catch(err){
        res.status(500).json({success:false, errore: err.message});
    }
});

//Metodo UPDATE per modificare le informazioni di un utente

router.put('/update/:id', async(req,res) => {
    try{
        //cerca un utente tramite l'id e aggiorna le informazioni in base alla req
        const utenteAggiornato = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});

        if(!utenteAggiornato){
            return res.status(404).json({
                success:false,
                messaggio: "Utente non trovato."
            })
        };
        res.status(200).json({
            success: true,
            messaggio: "Utente aggiornato con successo!",
            dati: utenteAggiornato
        });
    }catch(err){
        res.status(500).json({success:false, errore: err.message});
    }
});

//Metodo DELETE per eliminare un utente 
/*
router.delete('/delete/:id', async(req, res) => {
    try{
        //cerca un utente tramite l'id e lo elimina
        const utenteEliminato = await User.findByIdAndDelete(req.params.id);
        if(!utenteEliminato){
            return res.status(404).json({
                success:false,
                messaggio: "Utente non trovato"
            })
        };
        res.status(200).json({
            success: true,
            messaggio: "Utente eliminato con successo!"
        });
    }catch(err){
        res.status(500).json({success:false, errore:err.message});
    }
});
*/
module.exports = router;