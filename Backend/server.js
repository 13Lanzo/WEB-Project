//punto di ingresso dell'applicazione

//1. carica le variabili dal file .env all'avvio del processo
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dns = require('dns');
const epxress = require('express');
const mongoose = require('mongoose');
const http = require('http'); //permette di creare un server HTTP mediante il metodo create server
const httpStatus = require('http-status-codes'); 

//2. INZIALIZZA EXPRESS
const app = epxress();

// Middleware per il parsing del JSON
app.use(epxress.json());

const authRoutes = require('./routes/auth');
// Questo middleware dice a Express: "Prendi tutte le rotte dentro auth.js 
// e aggiungi davanti il prefisso /api/auth"
app.use('/api/auth', authRoutes)

//3. Definizione della Rotta di test ("Hello World")
app.get('/', (req, res) => {
    try{
        res.status(200).json({
        messaggio: "Ciao! Il server è attivo e funzionante."
    });
    } catch(err){
        console.error("Errore nella rotta di test:", err.message);
        res.status(500).json({
            err: "Si è verificato un errore interno al server.",
            dettaglio: err.message
        })
    };
});


//4. Richiama la variabile di ambiente per la connessione a MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('Errore: MONGODB_URI non è definito. Controlla il file .env nella radice del progetto.');
    process.exit(1);
}

try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    console.log('Usando DNS pubblici per la risoluzione SRV:', dns.getServers());
} catch (dnsErr) {
    console.warn('Impossibile impostare DNS pubblici per SRV:', dnsErr.message);
}

const mongooseOptions = {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    family: 4,
};

mongoose.connect(MONGODB_URI, mongooseOptions)
    .then(() => {
        console.log("Connesso correttamente a MongoDB Atlas!")
    })
    .catch((err) => {
        console.error("Errore di connessione a MongoDB Atlas:", err);
        if (err.code === 'ECONNREFUSED' || err.name === 'MongoServerSelectionError') {
            console.error('Verifica la risoluzione DNS SRV per cluster0.fcvqwbl.mongodb.net e la configurazione di Network Access in MongoDB Atlas.');
        }
    });

//5. AVVIO DEL SERVER IN ASCOLTO
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}...`);
    console.log('Testa la rotta su http://localhost:' + PORT + '/')
})