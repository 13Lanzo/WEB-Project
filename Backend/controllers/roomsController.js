const express = require('express');
const Room = require('../models/Room');

async function createStanza(req, res){
        try {
        const { titolo, 
            descrizione, 
            prezzo, 
            citta, 
            indirizzo, 
            superficie, 
            arredamento, 
            postiLettoTotali, 
            postiLettoDisponibili, 
            inquiliniAssegnati, 
            inquiliniNonRegistrati}=req.body;

        const creatoDa = req.user.id;

        // 1. Validazione base dei campi obbligatori
        if (!titolo || !descrizione || !prezzo || !citta || !indirizzo) {
            return res.status(400).json({ 
                success: false,
                errore: "Tutti i campi obbligatori devono essere compilati." 
            });
        }

        // 2. CONTROLLO DUPLICATI: Verifichiamo se questo utente ha già creato questo identico annuncio
        const stanzaEsistente = await Room.findOne({
            titolo: titolo,
            indirizzo: indirizzo,
            creatoDa: creatoDa
        });

        if (stanzaEsistente) {
            // Restituiamo un codice 409 Conflict, che è lo standard HTTP per i duplicati
            return res.status(409).json({
                success: false,
                messaggio: "Hai già pubblicato un annuncio per questa stanza con lo stesso titolo e indirizzo."
            });
        }

        // 3. Creazione della nuova stanza se non è un duplicato
        const nuovaStanza = new Room({
            titolo,
            descrizione, 
            prezzo,
            citta,
            indirizzo,
            creatoDa, 
            superficie,
            arredamento,
            postiLettoTotali,
            postiLettoDisponibili,
            inquiliniAssegnati,
            inquiliniNonRegistrati
        });

        // 4. Salvataggio della stanza nel DB
        const stanzaSalvata = await nuovaStanza.save();
        
        return res.status(201).json({
            success: true,
            messaggio: "Stanza creata con successo!",
            dati: stanzaSalvata
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            messaggio: "Si è verificato un errore interno al server",
            dettaglio: err.message
        });
    }
}

async function getStanze (req, res){
    try {
        // Estraiamo eventuali parametri di filtro dall'URL (es: ?citta=Bari&prezzoMax=350)
        const { citta, prezzoMin, prezzoMax } = req.query;
        let queryFiltri = {disponibile: true}; //mettiamo soltanto le stanze disponibili

        if (citta) {
            queryFiltri.citta = citta;
        }
        if (prezzoMin) {
            queryFiltri.prezzo = { ...queryFiltri.prezzo, $gte: parseFloat(prezzoMin) };
            // gte = Grater than or equal (maggiore o uguale) - 
            // usiamo parseFloat per convertire la stringa in numero decimale
            
        }
        if (prezzoMax) {
            queryFiltri.prezzo = { ...queryFiltri.prezzo, $lte: parseFloat(prezzoMax) };
            // lte = Less than or equal (minore o uguale)
        }

        // Eseguiamo la ricerca e popoliamo i dati del proprietario (mostrando solo nome ed email)
        const stanze = await Room.find(queryFiltri).populate('creatoDa', 'nome email');
        return res.status(200).json({
            success: true,
            messaggio: "Stanze trovate con successo!",
            dati: stanze
        });

    }
    catch (errore) {
        console.error("Errore nel recupero delle stanze:", errore.message);
        res.status(500).json({ errore: "Errore nel caricamento degli annunci." });
    }
}

async function getStanza(req, res){
    try {
        const stanza = await Room.findById(req.params.id).populate('creatoDa', 'nome email bio tagPreferenziale');

        if (!stanza) {
            return res.status(404).json({ errore: "Stanza non trovata." });
        }

        return res.status(200).json({
            success: true,
            messaggio: "Dettagli stanza recuperati con successo!",
            dati: stanza
        });
    }
    catch (errore) {
        console.error("Errore nel recupero dei dettagli della stanza:", errore.message);
        res.status(500).json({ errore: "ID annuncio non valido o errore di rete." });
    }
}

async function updateStanza(req, res){
    try {

        const stanza = await Room.findById(req.params.id);

        if(!stanza){
            return res.status(404).json({
                success: false,
                messaggio: "Stanza non trovata. Impossibile aggiornare."
            });
        }

        //controlliamo se l'utente loggato è il proprietario della stanza

        
        if(stanza.creatoDa.toString() !== req.user.id){
            return res.status(403).json({
                success: false,
                messaggio: "Azione non autorizzata. Non puoi modificare un annuncio non tuo."
            });
        }

        //se il controllo è autorizzato allora modifichiamo l'annuncio
        // { new: true } serve a restituire il documento aggiornato anziché quello vecchio
        const stanzaAggiornata = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
            // runValidators: true serve a far rispettare le regole di validazione 
            // definite nello schema Mongoose anche durante l'update 
            // (es: prezzo deve essere positivo, titolo obbligatorio, ecc.)
        );

        return res.status(200).json({
            success: true,
            messaggio: "Stanza aggiornata con successo!",
            dati: stanzaAggiornata
        });
    } catch (errore) {
        console.error("Errore nell'aggiornamento della stanza:", errore.message);
        res.status(500).json({ errore: "Errore durante la modifica dell'annuncio." });
    }
}

async function getMyStanza(req, res) {
    try{
        const mieStanze= await Room.find({creatoDa: req.user.id}).populate('inquiliniAssegnati','nome cognome email');
        return res.status(200).json({
            success: true,
            dati: mieStanze
        });
    } catch (errore){
        console.error('Errore nel recupero delle stanze personali:', errore.message);
        res.status(500).json({errore: 'Errore nel caricamento della tua area riservata.'});
    }
    
}

async function deleteStanza (req, res){
    try {
        //const stanzaCancellata = await Room.findByIdAndDelete(req.params.id);
        //cerchiamo la stanza all'interno del DB + relativo controllo 
        const stanza = await Room.findById(req.params.id);
        if(!stanza) {
            return res.status(404).json({
                success: false,
                messaggio: "Impossibile eliminare: annuncio non trovato."
            });
        }

        if(stanza.creatoDa.toString() !== req.user.id){
            return res.status(403).json({
                success: false,
                messaggio: "Azione non autorizzata. Non puoi eliminare un annuncio non tuo."
            })
        }

        //nel caso i controlli passano, elimino l'annuncio 
        await Room.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            messaggio: "Stanza eliminata con successo!"
        });
    } catch (errore) {
        console.error("Errore nella cancellazione della stanza:", errore.message);
        res.status(500).json({ errore: "Errore durante la cancellazione dell'annuncio." });
    }
}

module.exports = {
    createStanza,
    getStanze,
    getStanza,
    getMyStanza,
    updateStanza,
    deleteStanza
}