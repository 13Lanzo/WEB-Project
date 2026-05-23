const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// 1. CREA ANNUNCIO STANZA (CREATE) -> POST /api/rooms

router.post('/', async (req, res) => {
    try {
        const { titolo, descrizione, prezzo, citta, creatoDa } = req.body;

        //validazione base dei campi obbligatori
        if (!titolo || !descrizione || !prezzo || !citta || !creatoDa) {
            return res.status(400).json({ errore: "Tutti i campi obbligatori devono essere compilati." })
        }

        //Creazione della nuova stanza del modello
        const nuovaStnza = new Room({
            titolo,
            descrizione, 
            prezzo,
            citta,
            indirizzo,
            creatoDa, //qui passeremo l'ID dell'utente Host che pubblica la stanza
            serviziInclusi
        })

        //Salvataggio della stanza nel DB
        const stanzaSalvata = await nuovaStnza.save();
        return res.status(201).json({
            success: true,
            messaggio: "Stanza creata con successo!",
            dati: stanzaSalvata
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            messaggio: "Si + verificato un errore interno al server",
            dettaglio: err.message
        });
    }
});

// 2. RECUPERA TUTTI GLI ANNUNCI (READ) -> GET /api/rooms (Bacheca con filtri filtri prezzo/città)
router.get('/', async (req, res) => {
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
        res.status(200).json({
            success: true,
            messaggio: "Stanze trovate con successo!"
        });

    }
    catch (errore) {
        console.error("Errore nel recupero delle stanze:", errore.message);
        res.status(500).json({ errore: "Errore nel caricamento degli annunci." });
    }
});

// 3. DETTAGLIO singola STANZA SINGOLA (READ) -> GET /api/rooms/:id (Usa .populate('creatoDa'))
router.get('/:id', async (req, res) => {
    try {
        const stanza = await Room.findById(req.params.id).populate('creatoDa', 'nome email bio tagPreferenziale');

        if (!stanza) {
            return res.status(404).json({ errore: "Stanza non trovata." });
        }

        res.status(200).json({
            success: true,
            messaggio: "Dettagli stanza recuperati con successo!",
            dati: stanza
        });
    }
    catch (errore) {
        console.error("Errore nel recupero dei dettagli della stanza:", errore.message);
        res.status(500).json({ errore: "ID annuncio non valido o errore di rete." });
    }
});


// 4. MODIFICA ANNUNCIO (UPDATE) -> PUT /api/rooms/:id
router.put('/:id', async (req, res) => {
    try {
        // { new: true } serve a restituire il documento aggiornato anziché quello vecchio
        const stanzaAggiornata = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
            // runValidators: true serve a far rispettare le regole di validazione 
            // definite nello schema Mongoose anche durante l'update 
            // (es: prezzo deve essere positivo, titolo obbligatorio, ecc.)
        );

    if(!stanzaAggiornata) {
        return res.status(404).json({
            success: false,
            messaggio: "Stanza non trovata. Impossibile aggiornare."
        });
    }

    return res.status(200).json({
        success: true,
        messaggio: "Stanza aggiornata con successo!",
        dati: stanzaAggiornata
    });
    } catch (errore) {
        console.error("Errore nell'aggiornamento della stanza:", errore.message);
        res.status(500).json({ errore: "Errore durante la modifica dell'annuncio." });
    }
});

// 5. CANCELLA ANNUNCIO (DELETE) -> DELETE /api/rooms/:id
router.delete('/:id', async (req, res) => {
    try {
        const stanzaCancellata = await Room.findByIdAndDelete(req.params.id);
        if(!stanzaCancellata) {
            return res.status(404).json({
                success: false,
                messaggio: "Impossibile eliminare: annuncio non trovato."
            });
        }
        return res.status(200).json({
        success: true,
        messaggio: "Stanza eliminata con successo!"});
    } catch (errore) {
        console.error("Errore nella cancellazione della stanza:", errore.message);
        res.status(500).json({ errore: "Errore durante la cancellazione dell'annuncio." });
    }
});

module.exports = router;