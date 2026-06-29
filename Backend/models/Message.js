const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    mittente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    destinatario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    testo: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    letto: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }); // Specifica data e ora esatta dell'invio del messaggio

module.exports = mongoose.model('Message', MessageSchema);