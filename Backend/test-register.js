// test-register.js
const mongoose = require('mongoose');

// 1. Inserisci qui la stringa di connessione (MONGODB_URI) di MongoDB Atlas
// Sostituisci <username> e <password> con i tuoi dati reali del database user!
const MONGODB_URI = process.env.MONGODB_URI;

// 2. Definiamo lo Schema Mongoose per l'utente fuorisede (come da requisiti del modello dati)
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    nome: { type: String, required: true },
    eta: { type: Number },
    ruolo: { type: String, default: "studente" },
    tagPreferenze: [String]
});

// Creiamo il modello associato alla collezione "users"
const User = mongoose.model('User', UserSchema);

async function simulaRegistrazione() {
    try {
        console.log("🔄 Connessione a MongoDB Atlas in corso...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connesso al database cloud!");

        // Creiamo un finto documento di uno studente fuorisede per il test
        const fintoStudente = new User({
            email: "collega.test@poliba.it",
            nome: "Giuseppe Test",
            eta: 22,
            ruolo: "studente",
            tagPreferenze: ["ordinato", "non fumatore", "ingegneria"]
        });

        console.log("💾 Salvataggio dello studente sul database...");
        const utenteSalvato = await fintoStudente.save();
        
        console.log("🎉 REGISTRAZIONE SIMULATA CON SUCCESSO!");
        console.log("Dati salvati:", utenteSalvato);

    } catch (errore) {
        console.error("❌ Errore durante la simulazione:", errore.message);
    } finally {
        // Chiudiamo la connessione alla fine del test
        await mongoose.disconnect();
        console.log("🔌 Connessione chiusa.");
    }
}

// Avvia la simulazione
simulaRegistrazione();