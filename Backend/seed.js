// Questo script è usato per iniettare dei dati nel database MongoDB Atlas
// con utenti, messaggi e stanze.
const mongoose = require("mongoose");
const path = require("path");

// 1. Carichiamo le variabili d'ambiente dal file .env nella radice del backend
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

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
        await mongoose.connect(MONGODB_URI);
        console.log("Connesso a MongoDB Atlas!");

        // Pulizia dei dati esistenti
        await User.deleteMany({});
        await Room.deleteMany({});
        await Message.deleteMany({});
        console.log("Dati esistenti cancellati con successo.");

        // 3. Creazione degli utenti (10 Studenti e 10 Proprietari)
        const studentiData = [
            {
                nome: "Davide",
                cognome: "Lanzo",
                email: "d.lanzo@studenti.poliba.it",
                password: "PasswordSicura123",
                eta: 21,
                ruolo: "studente",
                tagPreferenze: ["ordinato", "non-fumatore"],
                bio: "Studente di Informatica al Poliba."
            },
            {
                nome: "Francesca",
                cognome: "Ciocca",
                email: "cioccafra@gmail.com",
                password: "password5",
                eta: 22,
                ruolo: "studente",
                tagPreferenze: ["tranquillo", "studio-notturno"],
                bio: "Studio Lettere all'Uniba, mi piace la tranquillità e leggere libri."
            },
            {
                nome: "Pierpaolo",
                cognome: "Cannone",
                email: "pier.test@poliba.it",
                password: "PasswordSicura123",
                eta: 22,
                ruolo: "studente",
                tagPreferenze: ["disordinato", "non-fumatore"],
                bio: "Studente di Ingegneria Automazione al Poliba."
            },
            {
                nome: "Marco",
                cognome: "Rossi",
                email: "marco.rossi@studenti.uniba.it",
                password: "PasswordSicura123",
                eta: 23,
                ruolo: "studente",
                tagPreferenze: ["sociale", "cucina"],
                bio: "Studente di Economia, amo cucinare per tutti e condividere le cene."
            },
            {
                nome: "Giulia",
                cognome: "Bianchi",
                email: "giulia.b@studenti.poliba.it",
                password: "PasswordSicura123",
                eta: 20,
                ruolo: "studente",
                tagPreferenze: ["sportivo", "ordinato"],
                bio: "Studio Architettura, amante dello sport e dell'ordine."
            },
            {
                nome: "Luca",
                cognome: "Verdi",
                email: "luca.v@studenti.uniba.it",
                password: "PasswordSicura123",
                eta: 24,
                ruolo: "studente",
                tagPreferenze: ["musica", "non-fumatore"],
                bio: "Studente di Giurisprudenza, suono la chitarra nel tempo libero."
            },
            {
                nome: "Sofia",
                cognome: "Russo",
                email: "sofia.r@studenti.poliba.it",
                password: "PasswordSicura123",
                eta: 21,
                ruolo: "studente",
                tagPreferenze: ["tranquillo", "animale-domestico"],
                bio: "Studio Ingegneria Edile, ho un piccolo gatto molto educato."
            },
            {
                nome: "Alessandro",
                cognome: "Ferrara",
                email: "ale.f@studenti.uniba.it",
                password: "PasswordSicura123",
                eta: 22,
                ruolo: "studente",
                tagPreferenze: ["cucina", "studio-notturno"],
                bio: "Studente di Lingue, adoro viaggiare e fare amicizia."
            },
            {
                nome: "Beatrice",
                cognome: "Neri",
                email: "bea.neri@studenti.poliba.it",
                password: "PasswordSicura123",
                eta: 22,
                ruolo: "studente",
                tagPreferenze: ["ordinato", "non-fumatore"],
                bio: "Studio Matematica, seria e molto rispettosa degli spazi."
            },
            {
                nome: "Giovanni",
                cognome: "Gallo",
                email: "giovanni.g@studenti.uniba.it",
                password: "PasswordSicura123",
                eta: 23,
                ruolo: "studente",
                tagPreferenze: ["sociale", "musica"],
                bio: "Studio Scienze Politiche, solare e pronto a condividere esperienze."
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
            },
            {
                nome: "Anna",
                cognome: "Gallo",
                email: "anna.gallo@outlook.it",
                password: "PasswordSicura123",
                eta: 60,
                ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Nonna e proprietaria, affitto camere solo a studenti referenziati."
            },
            {
                nome: "Luigi",
                cognome: "De Luca",
                email: "luigi.deluca@gmail.com",
                password: "PasswordSicura123",
                eta: 41,
                ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Affittacamere professionale, assistenza h24."
            },
            {
                nome: "Elena",
                cognome: "Costa",
                email: "elena.costa@hotmail.it",
                password: "PasswordSicura123",
                eta: 35,
                ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Proprietaria giovane e disponibile, appartamenti moderni."
            },
            {
                nome: "Francesco",
                cognome: "Giordano",
                email: "francesco.g@gmail.com",
                password: "PasswordSicura123",
                eta: 48,
                ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Proprietario attento alla manutenzione e ai dettagli."
            },
            {
                nome: "Lucia",
                cognome: "Rizzo",
                email: "lucia.rizzo@yahoo.com",
                password: "PasswordSicura123",
                eta: 55,
                ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Affitto stanze singole e doppie in zona tranquilla."
            },
            {
                nome: "Salvatore",
                cognome: "Barbieri",
                email: "salvatore.b@live.it",
                password: "PasswordSicura123",
                eta: 50,
                ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Monolocali e camere per studenti Poliba e Uniba."
            },
            {
                nome: "Caterina",
                cognome: "Fontana",
                email: "caterina.f@gmail.com",
                password: "PasswordSicura123",
                eta: 43,
                ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Appartamenti ristrutturati di recente in centro storico."
            }
        ];

        // Creazione studenti (usiamo .create in un loop/Promise.all per far scattare il pre-save hook di bcrypt)
        const studentiCreati = await Promise.all(
            studentiData.map(student => User.create(student))
        );
        console.log(`Creati ${studentiCreati.length} studenti.`);

        // Creazione proprietari
        const proprietariCreati = await Promise.all(
            proprietariData.map(prop => User.create(prop))
        );
        console.log(`Creati ${proprietariCreati.length} proprietari.`);

        // 4. Creazione delle stanze associate ai proprietari
        const stanzeData = [
            {
                titolo: "Stanza Singola Luminosa - Zona Policlinico",
                descrizione: "Luminosa e con balcone privato, ideale per studenti di medicina o infermieristica.",
                prezzo: 300,
                citta: "Bari",
                indirizzo: "Via Orazio Flacco 15",
                creatoDa: proprietariCreati[0]._id, // Roberto Esposito
                serviziInclusi: ["Wi-Fi", "Lavatrice", "Riscaldamento"],
                disponibile: true
            },
            {
                titolo: "Posto Letto in Doppia - Zona Policlinico",
                descrizione: "Stanza doppia spaziosa condivisa con un altro studente. Spese incluse.",
                prezzo: 200,
                citta: "Bari",
                indirizzo: "Via Orazio Flacco 15",
                creatoDa: proprietariCreati[0]._id, // Roberto Esposito
                serviziInclusi: ["Wi-Fi", "Lavatrice"],
                disponibile: true
            },
            {
                titolo: "Accogliente Singola vicino Ateneo",
                descrizione: "Camera singola arredata con letto, armadio e scrivania a pochi passi dall'Ateneo.",
                prezzo: 280,
                citta: "Bari",
                indirizzo: "Via Nicolai 40",
                creatoDa: proprietariCreati[1]._id, // Maria Romano
                serviziInclusi: ["Wi-Fi", "Riscaldamento"],
                disponibile: true
            },
            {
                titolo: "Camera Deluxe con bagno privato",
                descrizione: "Stanza grande in appartamento signorile. Bagno interno ad uso esclusivo.",
                prezzo: 380,
                citta: "Bari",
                indirizzo: "Corso Cavour 110",
                creatoDa: proprietariCreati[2]._id, // Antonio Bruno
                serviziInclusi: ["Wi-Fi", "Aria Condizionata", "TV"],
                disponibile: true
            },
            {
                titolo: "Singola per studentesse in appartamento condiviso",
                descrizione: "Stanza confortevole in appartamento per sole ragazze vicino al Politecnico.",
                prezzo: 270,
                citta: "Bari",
                indirizzo: "Via Re David 120",
                creatoDa: proprietariCreati[3]._id, // Anna Gallo
                serviziInclusi: ["Wi-Fi", "Balcone", "Lavatrice"],
                disponibile: true
            },
            {
                titolo: "Stanza Moderna vicino Stazione Centrale",
                descrizione: "Completamente ristrutturata, cucina abitabile in comune e servizio portierato.",
                prezzo: 320,
                citta: "Bari",
                indirizzo: "Piazza Moro 5",
                creatoDa: proprietariCreati[4]._id, // Luigi De Luca
                serviziInclusi: ["Wi-Fi", "Aria Condizionata", "Ascensore"],
                disponibile: true
            },
            {
                titolo: "Camera Doppia spaziosa per studenti",
                descrizione: "Stanza doppia con due letti singoli, armadio a 6 ante e due scrivanie.",
                prezzo: 220,
                citta: "Bari",
                indirizzo: "Piazza Moro 5",
                creatoDa: proprietariCreati[4]._id, // Luigi De Luca
                serviziInclusi: ["Wi-Fi", "Aria Condizionata"],
                disponibile: true
            },
            {
                titolo: "Luminosa Singola in attico ristrutturato",
                descrizione: "Stanza in attico al 7° piano con splendido terrazzo in comune.",
                prezzo: 350,
                citta: "Bari",
                indirizzo: "Via Dante 250",
                creatoDa: proprietariCreati[5]._id, // Elena Costa
                serviziInclusi: ["Wi-Fi", "Terrazzo", "Lavastoviglie"],
                disponibile: true
            },
            {
                titolo: "Stanza singola silenziosa per studio",
                descrizione: "Camera dotata di scrivania extra large e libreria a muro. Molto silenziosa.",
                prezzo: 260,
                citta: "Bari",
                indirizzo: "Via Fanelli 200",
                creatoDa: proprietariCreati[6]._id, // Francesco Giordano
                serviziInclusi: ["Wi-Fi", "Riscaldamento"],
                disponibile: true
            },
            {
                titolo: "Camera confortevole in zona Carrassi",
                descrizione: "Appartamento ben servito da supermercati e fermata del bus.",
                prezzo: 290,
                citta: "Bari",
                indirizzo: "Via Giulio Petroni 80",
                creatoDa: proprietariCreati[7]._id, // Lucia Rizzo
                serviziInclusi: ["Wi-Fi", "Ascensore", "Balcone"],
                disponibile: true
            },
            {
                titolo: "Monolocale indipendente per studenti/ricercatori",
                descrizione: "Monolocale con cucina privata e bagno privato. Ingresso indipendente.",
                prezzo: 450,
                citta: "Bari",
                indirizzo: "Via Amendola 150",
                creatoDa: proprietariCreati[8]._id, // Salvatore Barbieri
                serviziInclusi: ["Wi-Fi", "Aria Condizionata", "Cucina Privata"],
                disponibile: true
            },
            {
                titolo: "Elegante camera singola in centro",
                descrizione: "In palazzo d'epoca con servizio portierato, cucina abitabile attrezzata.",
                prezzo: 360,
                citta: "Bari",
                indirizzo: "Via Putignani 30",
                creatoDa: proprietariCreati[9]._id, // Caterina Fontana
                serviziInclusi: ["Wi-Fi", "Riscaldamento Autonomo"],
                disponibile: true
            }
        ];

        const stanzeCreate = await Room.insertMany(stanzeData);
        console.log(`Create ${stanzeCreate.length} stanze.`);

        // 5. Creazione dei messaggi (conversazioni tra studenti e proprietari)
        const messaggiData = [
            // Conversazione 1: Davide (studente 0) e Roberto (proprietario 0)
            {
                mittente: studentiCreati[0]._id,
                destinatario: proprietariCreati[0]._id,
                testo: "Salve Roberto! La stanza singola al Policlinico è ancora libera?",
                letto: true
            },
            {
                mittente: proprietariCreati[0]._id,
                destinatario: studentiCreati[0]._id,
                testo: "Ciao Davide! Sì, è ancora disponibile. Vorresti vederla?",
                letto: true
            },
            {
                mittente: studentiCreati[0]._id,
                destinatario: proprietariCreati[0]._id,
                testo: "Sì, andrebbe bene mercoledì pomeriggio verso le 16:00?",
                letto: false
            },
            // Conversazione 2: Francesca (studente 1) e Maria (proprietario 1)
            {
                mittente: studentiCreati[1]._id,
                destinatario: proprietariCreati[1]._id,
                testo: "Buonasera, volevo sapere se nel prezzo di 280 euro sono incluse le utenze.",
                letto: true
            },
            {
                mittente: proprietariCreati[1]._id,
                destinatario: studentiCreati[1]._id,
                testo: "Buonasera Francesca, il prezzo include condominio e internet. Luce e gas sono a consumo.",
                letto: false
            },
            // Conversazione 3: Pierpaolo (studente 2) e Antonio (proprietario 2)
            {
                mittente: studentiCreati[2]._id,
                destinatario: proprietariCreati[2]._id,
                testo: "Ciao, la camera deluxe con bagno privato in Corso Cavour ha l'aria condizionata?",
                letto: true
            },
            {
                mittente: proprietariCreati[2]._id,
                destinatario: studentiCreati[2]._id,
                testo: "Ciao Pierpaolo! Sì, c'è un climatizzatore inverter in camera ad uso autonomo.",
                letto: true
            },
            {
                mittente: studentiCreati[2]._id,
                destinatario: proprietariCreati[2]._id,
                testo: "Perfetto, ti ringrazio. Possiamo fissare una visita?",
                letto: false
            },
            // Altri messaggi di contatto vari
            {
                mittente: studentiCreati[3]._id, // Marco
                destinatario: proprietariCreati[4]._id, // Luigi
                testo: "Salve Luigi, accetta contratti registrati transitori per studenti universitari?",
                letto: true
            },
            {
                mittente: proprietariCreati[4]._id,
                destinatario: studentiCreati[3]._id,
                testo: "Certamente Marco, registriamo contratti transitori regolarmente registrati all'Agenzia delle Entrate.",
                letto: true
            },
            {
                mittente: studentiCreati[4]._id, // Giulia
                destinatario: proprietariCreati[5]._id, // Elena
                testo: "Ciao Elena, l'attico in Via Dante ha anche l'ascensore?",
                letto: false
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
