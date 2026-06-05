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
    superficie: {
        type: Number,
        default: 0
    },
    arredamento: {
        type: String,
        enum: ['Completo', 'Parziale', 'Vuoto'],
        default: 'Completo'
    },
    postiLettoTotali: {
        type: Number,
        default: 1
    },
    postiLettoDisponibili: {
        type: Number,
        default: 1
    },
    disponibilita: {
        type: String,
        default: 'Immediata'
    },
    // URL immagine scelta dal proprietario (una delle 4 di default del frontend)
    immagineUrl: {
        type: String,
        default: ''
    },
    // Relazione: ogni stanza appartiene a un proprietario
    creatoDa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Servizi inclusi (es. Wi-Fi, Aria Condizionata)
    serviziInclusi: {
        type: [String],
        default: []
    },
    // Tag caratteristiche (es. Non fumatore, Pet friendly)
    serviziTags: {
        type: [String],
        default: []
    },
    // Utenti registrati sul sito che vivono nella stanza
    inquiliniAssegnati: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Nomi fittizi di persone non registrate che vivono nella stanza
    abitantiNonRegistrati: {
        type: [String],
        default: []
    },
    disponibile: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);