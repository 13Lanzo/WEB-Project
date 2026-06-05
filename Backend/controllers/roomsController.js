const Room = require('../models/Room');

// 1. CREA ANNUNCIO (solo proprietari)
async function createStanza(req, res) {
    try {
        const {
            titolo, descrizione, prezzo, citta, indirizzo,
            superficie, arredamento, postiLettoTotali, postiLettoDisponibili,
            disponibilita, immagineUrl, serviziInclusi, serviziTags,
            inquiliniAssegnati, abitantiNonRegistrati
        } = req.body;

        const creatoDa = req.user.id;

        // Validazione campi obbligatori
        if (!titolo || !descrizione || !prezzo || !citta || !indirizzo) {
            return res.status(400).json({
                success: false,
                errore: "Tutti i campi obbligatori devono essere compilati."
            });
        }

        // Controllo duplicati
        const stanzaEsistente = await Room.findOne({
            titolo,
            indirizzo,
            creatoDa
        });

        if (stanzaEsistente) {
            return res.status(409).json({
                success: false,
                messaggio: "Hai già pubblicato un annuncio per questa stanza con lo stesso titolo e indirizzo."
            });
        }

        const nuovaStanza = new Room({
            titolo,
            descrizione,
            prezzo,
            citta,
            indirizzo,
            superficie: superficie || 0,
            arredamento: arredamento || 'Completo',
            postiLettoTotali: postiLettoTotali || 1,
            postiLettoDisponibili: postiLettoDisponibili || 1,
            disponibilita: disponibilita || 'Immediata',
            immagineUrl: immagineUrl || '',
            creatoDa,
            serviziInclusi: serviziInclusi || [],
            serviziTags: serviziTags || [],
            inquiliniAssegnati: inquiliniAssegnati || [],
            abitantiNonRegistrati: abitantiNonRegistrati || []
        });

        const stanzaSalvata = await nuovaStanza.save();

        // Popola i dati del proprietario nella risposta
        const stanzaPopolata = await stanzaSalvata.populate('creatoDa', 'nome cognome email');

        return res.status(201).json({
            success: true,
            messaggio: "Stanza creata con successo!",
            dati: stanzaPopolata
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            messaggio: "Si è verificato un errore interno al server",
            dettaglio: err.message
        });
    }
}

// 2. RECUPERA TUTTE LE STANZE DISPONIBILI (con filtri) — pubblica
async function getStanze(req, res) {
    try {
        const { citta, prezzoMin, prezzoMax } = req.query;
        let queryFiltri = { disponibile: true };

        if (citta) queryFiltri.citta = { $regex: citta, $options: 'i' };
        if (prezzoMin) queryFiltri.prezzo = { ...queryFiltri.prezzo, $gte: parseFloat(prezzoMin) };
        if (prezzoMax) queryFiltri.prezzo = { ...queryFiltri.prezzo, $lte: parseFloat(prezzoMax) };

        const stanze = await Room.find(queryFiltri)
            .populate('creatoDa', 'nome cognome email')
            .populate('inquiliniAssegnati', 'nome cognome email bio tagPreferenze facolta');

        return res.status(200).json({
            success: true,
            messaggio: "Stanze trovate con successo!",
            dati: stanze
        });

    } catch (errore) {
        console.error("Errore nel recupero delle stanze:", errore.message);
        res.status(500).json({ errore: "Errore nel caricamento degli annunci." });
    }
}

// 3. LE MIE STANZE (solo del proprietario loggato)
async function getMyStanze(req, res) {
    try {
        const stanze = await Room.find({ creatoDa: req.user.id })
            .populate('creatoDa', 'nome cognome email')
            .populate('inquiliniAssegnati', 'nome cognome email bio tagPreferenze facolta');

        return res.status(200).json({
            success: true,
            messaggio: "Le tue stanze sono state recuperate con successo!",
            dati: stanze
        });

    } catch (errore) {
        console.error("Errore nel recupero delle stanze dell'utente:", errore.message);
        res.status(500).json({ errore: "Errore nel caricamento dei tuoi annunci." });
    }
}

// 4. STANZA DELL'INQUILINO LOGGATO (se assegnata da un proprietario)
async function getMyRoom(req, res) {
    try {
        const stanza = await Room.findOne({ inquiliniAssegnati: req.user.id })
            .populate('creatoDa', 'nome cognome email')
            .populate('inquiliniAssegnati', 'nome cognome email bio tagPreferenze facolta');

        return res.status(200).json({
            success: true,
            dati: stanza || null
        });

    } catch (errore) {
        console.error("Errore nel recupero della stanza dell'inquilino:", errore.message);
        res.status(500).json({ errore: "Errore nel caricamento della tua stanza." });
    }
}

// 5. DETTAGLIO SINGOLA STANZA
async function getStanza(req, res) {
    try {
        const stanza = await Room.findById(req.params.id)
            .populate('creatoDa', 'nome cognome email bio tagPreferenze')
            .populate('inquiliniAssegnati', 'nome cognome email bio tagPreferenze facolta');

        if (!stanza) {
            return res.status(404).json({ errore: "Stanza non trovata." });
        }

        return res.status(200).json({
            success: true,
            messaggio: "Dettagli stanza recuperati con successo!",
            dati: stanza
        });

    } catch (errore) {
        console.error("Errore nel recupero dei dettagli della stanza:", errore.message);
        res.status(500).json({ errore: "ID annuncio non valido o errore di rete." });
    }
}

// 6. MODIFICA ANNUNCIO
async function updateStanza(req, res) {
    try {
        const stanza = await Room.findById(req.params.id);

        if (!stanza) {
            return res.status(404).json({
                success: false,
                messaggio: "Stanza non trovata. Impossibile aggiornare."
            });
        }

        if (stanza.creatoDa.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                messaggio: "Azione non autorizzata. Non puoi modificare un annuncio non tuo."
            });
        }

        const stanzaAggiornata = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
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

// 7. ELIMINA ANNUNCIO
async function deleteStanza(req, res) {
    try {
        const stanza = await Room.findById(req.params.id);

        if (!stanza) {
            return res.status(404).json({
                success: false,
                messaggio: "Impossibile eliminare: annuncio non trovato."
            });
        }

        if (stanza.creatoDa.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                messaggio: "Azione non autorizzata. Non puoi eliminare un annuncio non tuo."
            });
        }

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
    getMyStanze,
    getMyRoom,
    getStanza,
    updateStanza,
    deleteStanza
};