// Questo modello definisce gli annunci delle stanze in affitto. 
// Nota l'uso di mongoose.Schema.Types.ObjectId con il riferimento (ref) a User: 
// serve a creare una relazione UML 1-a-Molti, 
// legando indissolubilmente ogni stanza all'utente proprietario o coinquilino che l'ha pubblicata.
const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    titolo: {
        type: String,
        required: true,
        trim: true
    },
    descrizione: {
        type: String,
        required: true,
        maxlength: 1000
    },
    prezzo: {
        type: Number,
        required: true,
        min: 0 
    },
    citta: {
        type: String,
        required: true,
        trim: true
    }, 
    indirizzo: {
        type: String,
        required: true,
        trim: true
    },
    // Relazione: Ogni stanza appartiene a un Utente specifico (Proprietario/Host)
    creatoDa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Riferisce al modello User per creare la relazione
        required: true
    },
    superficie:{
        type: Number,
        required: true
    },
    arredamento:{
        type: Number,
        required:true
    },
    postiLettoTotali:{
        type: Number
    },
    postiLettoDisponibili:{
        type: Number
    },
    inquiliniAssegnati:{
        type: Number
    },
    inquiliniNonRegistrati:{
        type: Number
    }
}, { timestamps: true }); // Aggiunge automaticamente createdAt e updatedAt nel database

module.exports = mongoose.model('Room', RoomSchema);