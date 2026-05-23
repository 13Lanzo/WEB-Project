// (Il modello Mongoose dell'utente)
// //Questo file gestisce i profili degli studenti fuorisede o dei proprietari 
// e include l'array di stringhe per memorizzare i tag di preferenza (es. "non fumatore", "ordinato")
// che serviranno per la logica di accoppiamento dei coinquilini.


/* 🧠 Spiegazione della sintassi Mongoose (Fondamentale per l'orale)
Se il Prof. Ferrara dovesse chiedervi all'orale o durante la discussione del codice: "Perché usate i Modelli se MongoDB è un database NoSQL senza schemi fissi?", la risposta consapevole da dare è:

mongoose.Schema: Definisce la struttura logica del documento lato codice applicativo. Sebbene MongoDB sia flessibile e privo di schemi rigidi, Mongoose ci permette di applicare una validazione dei dati (come required: true o unique: true) prima che i dati vengano effettivamente inviati e scritti su MongoDB Atlas.

timestamps: true: Genera automaticamente i campi createdAt e updatedAt. È utilissimo per ordinare gli annunci dei coinquilini dai più recenti ai più vecchi o per mostrare i messaggi della chat in ordine cronologico esatto.

ref: 'User': Implementa i vincoli di integrità referenziale logica. Comunica a Mongoose che quel campo contiene l'ID di un documento presente nella collezione degli utenti, permettendoti in futuro di usare la funzione .populate() per recuperare con una sola riga di codice tutti i dettagli del proprietario (nome, email) quando visualizzi una stanza.
*/

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: true,
        trim: true // Rimuove spazi bianchi all'inizio e alla fine del nome
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Converte l'email in minuscolo per evitare duplicati
        trim:true
    },
    password: {
        type: String,
        required: true
    },
    eta:{
        type: Number,
        required: true,
        min: 18, // Età minima per registrarsi
        max: 100, // Età massima per registrarsi
        // gestire l'errore in caso di età!
    }, 
    ruolo: {
        type: String,
        required: true,
        enum: ['studente', 'lavotatore', 'proprietario'], // Accetta solo uno di questi  valori
        default: 'studente' // Se non specificato, assume che sia uno studente
    },
    tagPreferenze: {
        type: [String], 
        default: [] 
    },
    bio: {
        type: String,
        maxlength: 500 // Limita la lunghezza della biografia
    }
}, {
    timestamps: true // Aggiunge automaticamente createdAt e updatedAt nel database
});

module.exports = mongoose.model('User', UserSchema);
