// Questo script è usato per iniettare dei dati nel database MongoDB Atlas
// con utenti, messaggi e stanze.
const mongoose = require("mongoose");

// 1. Inserisco la libreria dotenv che contiene le variabili d'ambiente estratte dal file .env (inclusa la stringa di connessione MONGODB_URI)
require("dotenv").config();

// 2. Importiamo il modello User, Room e Message
// per poter creare documenti di utenti, stanze e messaggi nel database
const User = require("./models/User");
const Room = require("./models/Room");
const Message = require("./models/Message");

// 3. Async funcition per connettersi a MongoDB Atlas, creare un utente di test e salvarlo nel database
// infine chiude la connesione al database
async function seed(){
    try {
        // Connessione a MongoDB database usando la stringa di connessione MONGODB_URI
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connesso a MongoDB Atlas!");

        // Pulire dati esistenti dal User, Room e Message 
        // (opzionale, dipende se vuoi sovrascrivere o aggiungere)
        await User.deleteMany({});
        await Room.deleteMany({});
        await Message.deleteMany({});
        console.log("Dati esistenti cancellati.");

        // Creazione di un utente fittizio con dati di esempio specifici 
        // nome, email, password, eta, ruolo, tagPreferenze, bio
        const utenteFittizio = await User.create({
            nome: "Giuseppe",
            cognome: "Test",
            email: "giuseppe.test@poliba.it",
            password: "PasswordSicura123",
            eta: 22,
            ruolo: "studente",
            tagPreferenze: ["ordinato", "non-fumatore", "ingegneria"],
            bio: "Studente di Ingegneria Informatica al Poliba. Cerco coinquilini ordinati e non fumatori."
        });

        console.log("Utente fittizio creato:", utenteFittizio.nome);


        // Definisco un array di stanze di esempio da inserire in ROOM nel database, 
        // ognuna con un riferimento all'utente creato (utenteFittizio._id)
        const stanzeFittizie = [
            {
                titolo: "Stanza in centro a Milano",
                nome: "Stanza 1",
                descrizione: "Stanza comoda e ben arredata",
                prezzo: 500,
                citta: "Milano",
                indirizzo: "Via Roma 10",
                creatoDa: utenteFittizio._id,
                serviziInclusi: ["Wi-Fi", "Aria Condizionata"],
                disponibile: true
            },
            {
                titolo: "Stanza silenziosa e luminosa",
                nome: "Stanza 2",
                descrizione: "Stanza silenziosa e luminosa",
                prezzo: 350,
                citta: "Bari",
                indirizzo: "Via Bitritto 20",
                creatoDa: utenteFittizio._id,
                serviziInclusi: ["Wi-Fi", "Aria Condizionata"],
                disponibile: true,
            }
        ];

        //Inseriamo le stanze fittizie nella collezione Room del database 
        // e log dei numeri delle stanze create

        const stanzeCreate = await Room.insertMany(stanzeFittizie);
        console.log(`Crete ${stanzeCreate.length} stanze fittizie.`);

        // Definizione di un array di messaggi di esempio da inserire nel database,
        // ognuno con un riferimento all'utente creato (utenteFittizio._id) e a una stanza creata (stanzeCreate[0]._id)
        
        const messaggiFittizi = [
            {
                mittente: utenteFittizio._id,
                destinatario: utenteFittizio._id,
                testo: "Ciao! Come stai?",
                letto: false
            },
            {
                mittente: utenteFittizio._id,
                destinatario: utenteFittizio._id,
                testo: "Hai visto la stanza in centro a Milano?",
                letto: false
            },
            {
                mittente: utenteFittizio._id,
                destinatario: utenteFittizio._id,
                testo: "Sì, sembra molto comoda!",
                letto: true
            }
        ];

        // Inseriamo i messaggi fittizi nella collezione Message del database
        const messaggiCreati = await Message.insertMany(messaggiFittizzi);
        console.log(`Crete ${messaggiCreati.length} messaggi fittizi.`);

        // Chiudiamo la connessione al database dopo il seeding
        await mongoose.disconnect();
        console.log("Connessione a MongoDB Atlas chiusa. Seeding completato!");

    } catch (errore) {
        console.error("Errore durante il seeding:", errore.message);
        process.exit(1); // Esce con codice di errore
    }
}

seed(); // Avvia la funzione di seeding


// // Definiamo lo Schema Mongoose per l'utente fuorisede (come da requisiti del modello dati)
// const UserSchema = new mongoose.Schema({
//   email: { type: String, required: true },
//   nome: { type: String, required: true },
//   eta: { type: Number },
//   ruolo: { type: String, default: "studente" },
//   tagPreferenze: [String],
// });

// // Creiamo il modello associato alla collezione "users"
// const User = mongoose.model("User", UserSchema);

// async function simulaRegistrazione() {
//   try {
//     console.log("🔄 Connessione a MongoDB Atlas in corso...");
//     await mongoose.connect(MONGODB_URI);
//     console.log("✅ Connesso al database cloud!");

//     // Creiamo un finto documento di uno studente fuorisede per il test
//     const fintoStudente = new User({
//       email: "collega.test@poliba.it",
//       nome: "Giuseppe Test",
//       eta: 22,
//       ruolo: "studente",
//       tagPreferenze: ["ordinato", "non fumatore", "ingegneria"],
//     });

//     console.log("💾 Salvataggio dello studente sul database...");
//     const utenteSalvato = await fintoStudente.save();

//     console.log("🎉 REGISTRAZIONE SIMULATA CON SUCCESSO!");
//     console.log("Dati salvati:", utenteSalvato);
//   } catch (errore) {
//     console.error("❌ Errore durante la simulazione:", errore.message);
//   } finally {
//     // Chiudiamo la connessione alla fine del test
//     await mongoose.disconnect();
//     console.log("🔌 Connessione chiusa.");
//   }
// }

// // Avvia la simulazione
// simulaRegistrazione();
