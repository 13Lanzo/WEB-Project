//inserire tutte le rotte per gestire il login

const express = require('express');
const router = express.Router();
const User = require('../models/User'); //importa il modello user.js per interagire con il DB

//metodo POST per il login dell'utente

router.post('/', async(req, res) => {
    try{
        //leggiamo email e password passate dal client
        const {email, password} = req.body;

        //cerchiarmo l'utente nel DB
        const utente = await User.findOne({email: email});

        if(!utente){
            return res.status(401).json({
                success: false,
                messaggio: "Utente non trovato. Verifica l'email o la password!"
            });
        }

        //se trova l'utente nel DB, verifichiamo la corrispondenda della password
        if(utente.password !== password){
            return res.status(401).json({
                success: false,
                messaggio: "Credenziali non valide. Verifica email e password!"
            })
        }

        //se invece sia email che password sono corretti procediamo

        return res.status(200).json({
            success: true,
            messaggio: "Login effettuato con successo!",
            utente: {
                id: utente._id,
                nome: utente.nome,
                email: utente.email,
                ruolo: utente.ruolo
            }
        });
    } catch (err){
        res.status(500).json({
            success: false,
            messaggio: "Si è verificato un errore interno al server.",
            dettaglio: err.message
        })
    }
});

module.exports = router;