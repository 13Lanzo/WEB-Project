// Seed: inietta dati nel database MongoDB Atlas
// Utenti (inquilini e proprietari), stanze con nuovi campi, messaggi
// NOTA: il DNS override deve stare PRIMA di qualsiasi require mongoose

// Override DNS — necessario su alcune reti Windows per risolvere SRV MongoDB Atlas
const dns = require('dns');
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) { /* ignora */ }

const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const User = require("./models/User");
const Room = require("./models/Room");
const Message = require("./models/Message");

const DEFAULT_IMAGES = [
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80'
];

async function seed() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) throw new Error("MONGODB_URI non è definita nel file .env!");

        await mongoose.connect(MONGODB_URI);
        console.log("Connesso a MongoDB Atlas!");

        // Pulizia dati esistenti
        await User.deleteMany({});
        await Room.deleteMany({});
        await Message.deleteMany({});
        console.log("Dati esistenti cancellati con successo.");

        // -------------------------
        // CREAZIONE INQUILINI (10)
        // -------------------------
        const inquiliniData = [
            {
                nome: "Davide", cognome: "Lanzo",
                email: "d.lanzo@studenti.poliba.it",
                password: "PasswordSicura123",
                eta: 21, ruolo: "inquilino",
                facolta: "Ingegneria Informatica",
                tagPreferenze: ["ordinato", "non-fumatore"],
                bio: "Studente di Informatica al Poliba. Tranquillo e rispettoso degli spazi comuni."
            },
            {
                nome: "Francesca", cognome: "Ciocca",
                email: "cioccafra@gmail.com",
                password: "password5",
                eta: 22, ruolo: "inquilino",
                facolta: "Lettere e Filosofia",
                tagPreferenze: ["tranquillo", "studio-notturno"],
                bio: "Studio Lettere all'Uniba, mi piace la tranquillità e leggere libri."
            },
            {
                nome: "Pierpaolo", cognome: "Cannone",
                email: "pier.test@poliba.it",
                password: "PasswordSicura123",
                eta: 22, ruolo: "inquilino",
                facolta: "Ingegneria Automazione",
                tagPreferenze: ["disordinato", "non-fumatore"],
                bio: "Studente di Ingegneria Automazione al Poliba."
            },
            {
                nome: "Marco", cognome: "Rossi",
                email: "marco.rossi@studenti.uniba.it",
                password: "PasswordSicura123",
                eta: 23, ruolo: "inquilino",
                facolta: "Economia",
                tagPreferenze: ["sociale", "cucina"],
                bio: "Studente di Economia, amo cucinare per tutti e condividere le cene."
            },
            {
                nome: "Giulia", cognome: "Bianchi",
                email: "giulia.b@studenti.poliba.it",
                password: "PasswordSicura123",
                eta: 20, ruolo: "inquilino",
                facolta: "Architettura",
                tagPreferenze: ["sportivo", "ordinato"],
                bio: "Studio Architettura, amante dello sport e dell'ordine."
            },
            {
                nome: "Luca", cognome: "Verdi",
                email: "luca.v@studenti.uniba.it",
                password: "PasswordSicura123",
                eta: 24, ruolo: "inquilino",
                facolta: "Giurisprudenza",
                tagPreferenze: ["musica", "non-fumatore"],
                bio: "Studente di Giurisprudenza, suono la chitarra nel tempo libero."
            },
            {
                nome: "Sofia", cognome: "Russo",
                email: "sofia.r@studenti.poliba.it",
                password: "PasswordSicura123",
                eta: 21, ruolo: "inquilino",
                facolta: "Ingegneria Edile",
                tagPreferenze: ["tranquillo", "animale-domestico"],
                bio: "Studio Ingegneria Edile, ho un piccolo gatto molto educato."
            },
            {
                nome: "Alessandro", cognome: "Ferrara",
                email: "ale.f@studenti.uniba.it",
                password: "PasswordSicura123",
                eta: 22, ruolo: "inquilino",
                facolta: "Lingue e Letterature",
                tagPreferenze: ["cucina", "studio-notturno"],
                bio: "Studente di Lingue, adoro viaggiare e fare amicizia."
            },
            {
                nome: "Beatrice", cognome: "Neri",
                email: "bea.neri@studenti.poliba.it",
                password: "PasswordSicura123",
                eta: 22, ruolo: "inquilino",
                facolta: "Matematica",
                tagPreferenze: ["ordinato", "non-fumatore"],
                bio: "Studio Matematica, seria e molto rispettosa degli spazi."
            },
            {
                nome: "Giovanni", cognome: "Gallo",
                email: "giovanni.g@studenti.uniba.it",
                password: "PasswordSicura123",
                eta: 23, ruolo: "inquilino",
                facolta: "Scienze Politiche",
                tagPreferenze: ["sociale", "musica"],
                bio: "Studio Scienze Politiche, solare e pronto a condividere esperienze."
            }
        ];

        // -------------------------
        // CREAZIONE PROPRIETARI (10)
        // -------------------------
        const proprietariData = [
            {
                nome: "Roberto", cognome: "Esposito",
                email: "roberto.esposito@gmail.com",
                password: "PasswordSicura123",
                eta: 45, ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Proprietario di appartamenti per studenti a Bari."
            },
            {
                nome: "Maria", cognome: "Romano",
                email: "maria.romano@libero.it",
                password: "PasswordSicura123",
                eta: 52, ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Gestisco alloggi universitari in centro città."
            },
            {
                nome: "Antonio", cognome: "Bruno",
                email: "antonio.bruno@yahoo.it",
                password: "PasswordSicura123",
                eta: 38, ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Offro stanze in affitto arredate e vicine ai campus."
            },
            {
                nome: "Anna", cognome: "Gallo",
                email: "anna.gallo@outlook.it",
                password: "PasswordSicura123",
                eta: 60, ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Nonna e proprietaria, affitto camere solo a studenti referenziati."
            },
            {
                nome: "Luigi", cognome: "De Luca",
                email: "luigi.deluca@gmail.com",
                password: "PasswordSicura123",
                eta: 41, ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Affittacamere professionale, assistenza h24."
            },
            {
                nome: "Elena", cognome: "Costa",
                email: "elena.costa@hotmail.it",
                password: "PasswordSicura123",
                eta: 35, ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Proprietaria giovane e disponibile, appartamenti moderni."
            },
            {
                nome: "Francesco", cognome: "Giordano",
                email: "francesco.g@gmail.com",
                password: "PasswordSicura123",
                eta: 48, ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Proprietario attento alla manutenzione e ai dettagli."
            },
            {
                nome: "Lucia", cognome: "Rizzo",
                email: "lucia.rizzo@yahoo.com",
                password: "PasswordSicura123",
                eta: 55, ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Affitto stanze singole e doppie in zona tranquilla."
            },
            {
                nome: "Salvatore", cognome: "Barbieri",
                email: "salvatore.b@live.it",
                password: "PasswordSicura123",
                eta: 50, ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Monolocali e camere per studenti Poliba e Uniba."
            },
            {
                nome: "Caterina", cognome: "Fontana",
                email: "caterina.f@gmail.com",
                password: "PasswordSicura123",
                eta: 43, ruolo: "proprietario",
                tagPreferenze: [],
                bio: "Appartamenti ristrutturati di recente in centro storico."
            }
        ];

        const inquiliniCreati = await Promise.all(
            inquiliniData.map(u => User.create(u))
        );
        console.log(`Creati ${inquiliniCreati.length} inquilini.`);

        const proprietariCreati = await Promise.all(
            proprietariData.map(p => User.create(p))
        );
        console.log(`Creati ${proprietariCreati.length} proprietari.`);

        // -------------------------
        // CREAZIONE STANZE (12)
        // -------------------------
        const stanzeData = [
            {
                titolo: "Stanza Singola Luminosa - Zona Policlinico",
                descrizione: "Luminosa e con balcone privato, ideale per studenti di medicina o infermieristica. Appartamento signorile al 3° piano con ascensore.",
                prezzo: 300, citta: "Bari", indirizzo: "Via Orazio Flacco 15",
                superficie: 16, arredamento: "Completo",
                postiLettoTotali: 1, postiLettoDisponibili: 0,
                disponibilita: "Occupata",
                immagineUrl: DEFAULT_IMAGES[0],
                creatoDa: proprietariCreati[0]._id,
                serviziInclusi: ["Wi-Fi", "Lavatrice", "Riscaldamento"],
                serviziTags: ["Non fumatore", "Tranquillo"],
                inquiliniAssegnati: [inquiliniCreati[0]._id], // Davide Lanzo
                abitantiNonRegistrati: [],
                disponibile: true
            },
            {
                titolo: "Posto Letto in Doppia - Zona Policlinico",
                descrizione: "Stanza doppia spaziosa condivisa con un altro studente. Spese incluse nel prezzo.",
                prezzo: 200, citta: "Bari", indirizzo: "Via Orazio Flacco 15",
                superficie: 20, arredamento: "Completo",
                postiLettoTotali: 2, postiLettoDisponibili: 1,
                disponibilita: "Immediata",
                immagineUrl: DEFAULT_IMAGES[1],
                creatoDa: proprietariCreati[0]._id,
                serviziInclusi: ["Wi-Fi", "Lavatrice"],
                serviziTags: ["Non fumatore", "Luminoso"],
                inquiliniAssegnati: [inquiliniCreati[1]._id], // Francesca Ciocca
                abitantiNonRegistrati: [],
                disponibile: true
            },
            {
                titolo: "Accogliente Singola vicino Ateneo",
                descrizione: "Camera singola arredata con letto, armadio e scrivania a pochi passi dall'Ateneo.",
                prezzo: 280, citta: "Bari", indirizzo: "Via Nicolai 40",
                superficie: 14, arredamento: "Completo",
                postiLettoTotali: 1, postiLettoDisponibili: 1,
                disponibilita: "Settembre 2025",
                immagineUrl: DEFAULT_IMAGES[2],
                creatoDa: proprietariCreati[1]._id,
                serviziInclusi: ["Wi-Fi", "Riscaldamento"],
                serviziTags: ["Tranquillo", "Eco-friendly"],
                inquiliniAssegnati: [],
                abitantiNonRegistrati: [],
                disponibile: true
            },
            {
                titolo: "Camera Deluxe con bagno privato",
                descrizione: "Stanza grande in appartamento signorile. Bagno interno ad uso esclusivo.",
                prezzo: 380, citta: "Bari", indirizzo: "Corso Cavour 110",
                superficie: 22, arredamento: "Completo",
                postiLettoTotali: 1, postiLettoDisponibili: 1,
                disponibilita: "Immediata",
                immagineUrl: DEFAULT_IMAGES[3],
                creatoDa: proprietariCreati[2]._id,
                serviziInclusi: ["Wi-Fi", "Aria Condizionata", "TV"],
                serviziTags: ["Aria Condizionata", "Non fumatore"],
                inquiliniAssegnati: [inquiliniCreati[2]._id], // Pierpaolo Cannone
                abitantiNonRegistrati: ["Carlo Ricci"],
                disponibile: true
            },
            {
                titolo: "Singola per studentesse in appartamento condiviso",
                descrizione: "Stanza confortevole in appartamento per sole ragazze vicino al Politecnico.",
                prezzo: 270, citta: "Bari", indirizzo: "Via Re David 120",
                superficie: 12, arredamento: "Parziale",
                postiLettoTotali: 1, postiLettoDisponibili: 1,
                disponibilita: "Ottobre 2025",
                immagineUrl: DEFAULT_IMAGES[0],
                creatoDa: proprietariCreati[3]._id,
                serviziInclusi: ["Wi-Fi", "Balcone", "Lavatrice"],
                serviziTags: ["Tranquillo", "Luminoso"],
                inquiliniAssegnati: [inquiliniCreati[3]._id, inquiliniCreati[4]._id],
                abitantiNonRegistrati: [],
                disponibile: true
            },
            {
                titolo: "Stanza Moderna vicino Stazione Centrale",
                descrizione: "Completamente ristrutturata, cucina abitabile in comune e servizio portierato.",
                prezzo: 320, citta: "Bari", indirizzo: "Piazza Moro 5",
                superficie: 18, arredamento: "Completo",
                postiLettoTotali: 1, postiLettoDisponibili: 1,
                disponibilita: "Immediata",
                immagineUrl: DEFAULT_IMAGES[1],
                creatoDa: proprietariCreati[4]._id,
                serviziInclusi: ["Wi-Fi", "Aria Condizionata", "Ascensore"],
                serviziTags: ["Aria Condizionata", "Pet friendly"],
                inquiliniAssegnati: [],
                abitantiNonRegistrati: ["Mario Bianchi"],
                disponibile: true
            },
            {
                titolo: "Camera Doppia spaziosa per studenti",
                descrizione: "Stanza doppia con due letti singoli, armadio a 6 ante e due scrivanie.",
                prezzo: 220, citta: "Bari", indirizzo: "Piazza Moro 5",
                superficie: 24, arredamento: "Completo",
                postiLettoTotali: 2, postiLettoDisponibili: 2,
                disponibilita: "Immediata",
                immagineUrl: DEFAULT_IMAGES[2],
                creatoDa: proprietariCreati[4]._id,
                serviziInclusi: ["Wi-Fi", "Aria Condizionata"],
                serviziTags: ["Aria Condizionata", "Non fumatore"],
                inquiliniAssegnati: [inquiliniCreati[5]._id],
                abitantiNonRegistrati: [],
                disponibile: true
            },
            {
                titolo: "Luminosa Singola in attico ristrutturato",
                descrizione: "Stanza in attico al 7° piano con splendido terrazzo in comune.",
                prezzo: 350, citta: "Bari", indirizzo: "Via Dante 250",
                superficie: 19, arredamento: "Completo",
                postiLettoTotali: 1, postiLettoDisponibili: 1,
                disponibilita: "Luglio 2025",
                immagineUrl: DEFAULT_IMAGES[3],
                creatoDa: proprietariCreati[5]._id,
                serviziInclusi: ["Wi-Fi", "Terrazzo", "Lavastoviglie"],
                serviziTags: ["Terrazzo", "Luminoso", "Non fumatore"],
                inquiliniAssegnati: [inquiliniCreati[6]._id],
                abitantiNonRegistrati: [],
                disponibile: true
            },
            {
                titolo: "Stanza singola silenziosa per studio",
                descrizione: "Camera dotata di scrivania extra large e libreria a muro. Molto silenziosa.",
                prezzo: 260, citta: "Bari", indirizzo: "Via Fanelli 200",
                superficie: 15, arredamento: "Completo",
                postiLettoTotali: 1, postiLettoDisponibili: 1,
                disponibilita: "Immediata",
                immagineUrl: DEFAULT_IMAGES[0],
                creatoDa: proprietariCreati[6]._id,
                serviziInclusi: ["Wi-Fi", "Riscaldamento"],
                serviziTags: ["Tranquillo", "Non fumatore"],
                inquiliniAssegnati: [inquiliniCreati[7]._id],
                abitantiNonRegistrati: [],
                disponibile: true
            },
            {
                titolo: "Camera confortevole in zona Carrassi",
                descrizione: "Appartamento ben servito da supermercati e fermata del bus.",
                prezzo: 290, citta: "Bari", indirizzo: "Via Giulio Petroni 80",
                superficie: 17, arredamento: "Parziale",
                postiLettoTotali: 1, postiLettoDisponibili: 1,
                disponibilita: "Settembre 2025",
                immagineUrl: DEFAULT_IMAGES[1],
                creatoDa: proprietariCreati[7]._id,
                serviziInclusi: ["Wi-Fi", "Ascensore", "Balcone"],
                serviziTags: ["Terrazzo", "Pet friendly"],
                inquiliniAssegnati: [inquiliniCreati[8]._id],
                abitantiNonRegistrati: [],
                disponibile: true
            },
            {
                titolo: "Monolocale indipendente per studenti/ricercatori",
                descrizione: "Monolocale con cucina privata e bagno privato. Ingresso indipendente.",
                prezzo: 450, citta: "Bari", indirizzo: "Via Amendola 150",
                superficie: 35, arredamento: "Completo",
                postiLettoTotali: 1, postiLettoDisponibili: 1,
                disponibilita: "Immediata",
                immagineUrl: DEFAULT_IMAGES[2],
                creatoDa: proprietariCreati[8]._id,
                serviziInclusi: ["Wi-Fi", "Aria Condizionata", "Cucina Privata"],
                serviziTags: ["Aria Condizionata", "Non fumatore", "Luminoso"],
                inquiliniAssegnati: [inquiliniCreati[9]._id],
                abitantiNonRegistrati: [],
                disponibile: true
            },
            {
                titolo: "Elegante camera singola in centro",
                descrizione: "In palazzo d'epoca con servizio portierato, cucina abitabile attrezzata.",
                prezzo: 360, citta: "Bari", indirizzo: "Via Putignani 30",
                superficie: 18, arredamento: "Completo",
                postiLettoTotali: 1, postiLettoDisponibili: 1,
                disponibilita: "Ottobre 2025",
                immagineUrl: DEFAULT_IMAGES[3],
                creatoDa: proprietariCreati[9]._id,
                serviziInclusi: ["Wi-Fi", "Riscaldamento Autonomo"],
                serviziTags: ["Tranquillo", "Non fumatore"],
                inquiliniAssegnati: [],
                abitantiNonRegistrati: ["Lucia Mancini", "Roberto Fazio"],
                disponibile: true
            }
        ];

        const stanzeCreate = await Room.insertMany(stanzeData);
        console.log(`Create ${stanzeCreate.length} stanze.`);

        // -------------------------
        // CREAZIONE MESSAGGI
        // -------------------------
        const messaggiData = [
            // Davide → Roberto (proprietario 0)
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
            {
                mittente: inquiliniCreati[0]._id,
                destinatario: proprietariCreati[0]._id,
                testo: "Sì, andrebbe bene mercoledì pomeriggio verso le 16:00?",
                letto: false
            },
            // Francesca → Maria (proprietario 1)
            {
                mittente: inquiliniCreati[1]._id,
                destinatario: proprietariCreati[1]._id,
                testo: "Buonasera, volevo sapere se nel prezzo di 280 euro sono incluse le utenze.",
                letto: true
            },
            {
                mittente: proprietariCreati[1]._id,
                destinatario: inquiliniCreati[1]._id,
                testo: "Buonasera Francesca! Il prezzo include condominio e internet. Luce e gas sono a consumo.",
                letto: false
            },
            // Pierpaolo → Antonio (proprietario 2)
            {
                mittente: inquiliniCreati[2]._id,
                destinatario: proprietariCreati[2]._id,
                testo: "Ciao, la camera deluxe con bagno privato in Corso Cavour ha l'aria condizionata?",
                letto: true
            },
            {
                mittente: proprietariCreati[2]._id,
                destinatario: inquiliniCreati[2]._id,
                testo: "Ciao Pierpaolo! Sì, c'è un climatizzatore inverter in camera ad uso autonomo.",
                letto: true
            },
            {
                mittente: inquiliniCreati[2]._id,
                destinatario: proprietariCreati[2]._id,
                testo: "Perfetto, ti ringrazio. Possiamo fissare una visita?",
                letto: false
            },
            // Marco → Luigi (proprietario 4)
            {
                mittente: inquiliniCreati[3]._id,
                destinatario: proprietariCreati[4]._id,
                testo: "Salve Luigi, accetta contratti registrati transitori per studenti universitari?",
                letto: true
            },
            {
                mittente: proprietariCreati[4]._id,
                destinatario: inquiliniCreati[3]._id,
                testo: "Certamente Marco, registriamo contratti transitori regolarmente registrati all'Agenzia delle Entrate.",
                letto: true
            },
            // Giulia → Elena (proprietario 5)
            {
                mittente: inquiliniCreati[4]._id,
                destinatario: proprietariCreati[5]._id,
                testo: "Ciao Elena, l'attico in Via Dante ha anche l'ascensore?",
                letto: false
            }
        ];

        const messaggiCreati = await Message.insertMany(messaggiData);
        console.log(`Creati ${messaggiCreati.length} messaggi.`);

        await mongoose.disconnect();
        console.log("\n✅ Seeding completato con successo!");
        console.log("📧 Credenziali di test:");
        console.log("  Inquilino:    cioccafra@gmail.com   / password5");
        console.log("  Inquilino:    d.lanzo@studenti.poliba.it / PasswordSicura123");
        console.log("  Proprietario: roberto.esposito@gmail.com / PasswordSicura123");
        console.log("  Proprietario: maria.romano@libero.it    / PasswordSicura123");

    } catch (errore) {
        console.error("Errore durante il seeding:", errore.message);
        process.exit(1);
    }
}

seed();
