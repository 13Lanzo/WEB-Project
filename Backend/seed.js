// Questo script è usato per iniettare dei dati nel database MongoDB Atlas
// con utenti, messaggi e stanze.
const mongoose = require("mongoose");
const path = require("path");

const dns = require("dns");

// 1. Carichiamo le variabili d'ambiente dal file .env nella radice del backend
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

// Configurazione DNS per supportare la risoluzione dei record SRV di Atlas in ambienti locali
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (dnsErr) {
  console.warn("Impossibile impostare DNS pubblici per SRV:", dnsErr.message);
}

// 2. Importiamo i modelli User, Room e Message
const User = require("./models/User");
const Room = require("./models/Room");
const Message = require("./models/Message");

async function seed() {
    try {
        // Connessione a MongoDB database
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI non è definita nel file .env!");
        }
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            family: 4,
        });
        console.log("Connesso a MongoDB Atlas!");

        // Pulizia dei dati esistenti
        await User.deleteMany({});
        await Room.deleteMany({});
        await Message.deleteMany({});
        console.log("Dati esistenti cancellati con successo.");

        // 3. Creazione degli utenti (3 Inquilini e 3 Proprietari)
        const inquiliniData = [
            {
                nome: "Davide",
                cognome: "Lanzo",
                email: "d.lanzo@studenti.poliba.it",
                password: "PasswordSicura123",
                eta: 21,
                ruolo: "inquilino",
                facolta: "Ingegneria",
                tagPreferenze: ["ordinato", "non-fumatore"],
                bio: "Studente di Informatica al Poliba."
            },
            {
                nome: "Francesca",
                cognome: "Ciocca",
                email: "cioccafra@gmail.com",
                password: "password5",
                eta: 22,
                ruolo: "inquilino",
                facolta: "Medicina",
                tagPreferenze: ["tranquillo", "studio-notturno"],
                bio: "Studio Lettere all'Uniba, mi piace la tranquillità e leggere libri."
            },
            {
                nome: "Pierpaolo",
                cognome: "Cannone",
                email: "pier.test@poliba.it",
                password: "PasswordSicura123",
                eta: 22,
                ruolo: "inquilino",
                facolta: "Ingegneria",
                tagPreferenze: ["disordinato", "non-fumatore"],
                bio: "Studente di Ingegneria Automazione al Poliba."
            }
        ];

        const proprietariData = [
            {
                nome: "Roberto",
                cognome: "Esposito",
                email: "roberto.esposito@gmail.com",
                password: "PasswordSicura123",
                eta: 45,
                ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Proprietario di appartamenti per studenti a Bari."
            },
            {
                nome: "Maria",
                cognome: "Romano",
                email: "maria.romano@libero.it",
                password: "PasswordSicura123",
                eta: 52,
                ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Gestisco alloggi universitari in centro città."
            },
            {
                nome: "Antonio",
                cognome: "Bruno",
                email: "antonio.bruno@yahoo.it",
                password: "PasswordSicura123",
                eta: 38,
                ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Offro stanze in affitto arredate e vicine ai campus."
            }
        ];

        // Creazione inquilini (usiamo .create in un loop/Promise.all per far scattare il pre-save hook di bcrypt)
        const inquiliniCreati = await Promise.all(
            inquiliniData.map(student => User.create(student))
        );
        console.log(`Creati ${inquiliniCreati.length} inquilini.`);

        // Creazione proprietari
        const proprietariCreati = await Promise.all(
            proprietariData.map(prop => User.create(prop))
        );
        console.log(`Creati ${proprietariCreati.length} proprietari.`);

        // 4. Creazione delle stanze associate ai proprietari, con relazioni 1:1 con gli inquilini assegnati
        const stanzeData = [
            {
                titolo: "Stanza Singola Luminosa - Zona Policlinico",
                descrizione: "Luminosa e con balcone privato, ideale per studenti di medicina o infermieristica.",
                prezzo: 300,
                citta: "Bari",
                indirizzo: "Via Orazio Flacco 15",
                creatoDa: proprietariCreati[0]._id, // Roberto Esposito
                superficie: 20,
                arredamento: "Completo",
                disponibilita: "Immediata",
                immagineUrl: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
                postiLettoTotali: 1,
                postiLettoDisponibili: 0,
                inquiliniAssegnati: [inquiliniCreati[0]._id], // Davide Lanzo
                abitantiNonRegistrati: ["Luca"]
            },
            {
                titolo: "Posto Letto in Doppia - Zona Policlinico",
                descrizione: "Stanza doppia spaziosa condivisa con un altro studente. Spese incluse.",
                prezzo: 200,
                citta: "Bari",
                indirizzo: "Via Orazio Flacco 15",
                creatoDa: proprietariCreati[0]._id, // Roberto Esposito
                superficie: 20,
                arredamento: "Nessuno",
                disponibilita: "Immediata",
                immagineUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
                postiLettoTotali: 2,
                postiLettoDisponibili: 1,
                inquiliniAssegnati: [inquiliniCreati[1]._id], // Francesca Ciocca
                abitantiNonRegistrati: ["Sofia"]
            },
            {
                titolo: "Accogliente Singola vicino Ateneo",
                descrizione: "Camera singola arredata con letto, armadio e scrivania a pochi passi dall'Ateneo.",
                prezzo: 280,
                citta: "Bari",
                indirizzo: "Via Nicolai 40",
                creatoDa: proprietariCreati[1]._id, // Maria Romano
                superficie: 20,
                arredamento: "Completo",
                disponibilita: "Da Settembre",
                immagineUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
                postiLettoTotali: 3,
                postiLettoDisponibili: 2,
                inquiliniAssegnati: [inquiliniCreati[2]._id], // Pierpaolo Cannone
                abitantiNonRegistrati: ["Giulia"]
            }
        ];

        const stanzeCreate = await Room.insertMany(stanzeData);
        console.log(`Create ${stanzeCreate.length} stanze.`);

        // 5. Creazione dei messaggi (conversazioni tra inquilini e proprietari)
        const messaggiData = [
            // Conversazione 1: Davide (inquilino 0) e Roberto (proprietario 0)
            {
                mittente: inquiliniCreati[0]._id,
                destinatario: proprietariCreati[0]._id,
                testo: "Salve Roberto! La stanza singola al Policlinico è ancora libera?",
                letto: true
            },
            {
                mittente: proprietariCreati[0]._id,
                destinatario: inquiliniCreati[0]._id,
                testo: "Ciao Davide! Sì, è ancora disponibile. Vorresti vederla?",
                letto: true
            },
            // Conversazione 2: Francesca (inquilino 1) e Maria (proprietario 1)
            {
                mittente: inquiliniCreati[1]._id,
                destinatario: proprietariCreati[1]._id,
                testo: "Buonasera, volevo sapere se nel prezzo di 280 euro sono incluse le utenze.",
                letto: true
            }
        ];

        const messaggiCreati = await Message.insertMany(messaggiData);
        console.log(`Creati ${messaggiCreati.length} messaggi.`);

        await mongoose.disconnect();
        console.log("Connessione a MongoDB Atlas chiusa. Seeding completato con successo!");

    } catch (errore) {
        console.error("Errore durante il seeding:", errore.message);
        process.exit(1);
    }
}

seed();
