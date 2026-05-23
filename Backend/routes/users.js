const express = require('express');
const router = express.Router();
const User = require('../models/User');
// const authMiddleware = require('../middleware/auth'); // Ti servirà per proteggere le rotte

//metodo GET per ottenere tutte le informazioni di tutti utenti
router.get('/', async (req, res) => {
    try{
        const utenti= await User.find().select('-password'); //escludiamo la password dalla risposta
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

//metodo GET per ottenere tutte le informazioni di un utente
router.get('/:id', async (req, res) => {
    try{
        const utente = await User.findById(req.params.id).select('-password'); //escludiamo la password dalla risposta

        if(!utente){
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

router.delete('/:id', async (req, res) => {
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
});

module.exports = router;