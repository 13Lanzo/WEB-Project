// Essenziale per la chat real-time. 
// Memorizza chi invia il messaggio, chi lo riceve e il testo. 
// Ti permetterà di salvare permanentemente lo storico delle chat gestite tramite Socket.IO.


const moongose = require('mongoose');

const MessageSchema = new.moongose.MessageSchema({
    mittente: {
        type: moongose.Schema.Types.ObjectId,
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
    }, 
    timestamps: true // Specifica data e ora esatta dell'invio del messaggio
})

module.exports = mongoose.model('Message', MessageSchema);