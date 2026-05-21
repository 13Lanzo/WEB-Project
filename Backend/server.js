//punto di ingresso dell'applicazione

//1. carica le variabili dal file .env all'avvio del processo
require('dotenv').config();

const epxress = require('express');
const mongoose = require('mongoose');

//2. INZIALIZZA EXPRESS
const app = epxress();

//Middleware per il parsing del JSON
app.use(epxress.json());

//3. Definizioen della Rotta di test ("Hello World")
app.get('/', (req, res) => {
    res.status(200).json({
        messaggio: "Ciao! Il server è attivo e funzionante."
    });
});

//4. Richiama la variabile di ambiente per la connessione a MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Connesso correttamente a MongoDB Atlas!")
    })
    .catch((err) => {
        console.error("Errore di connessione a MongoDB Atlas:", err.message)
    });

//5. AVVIO DEL SERVER IN ASCOLTO
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}...`);
    console.log('Testa la rotta su http://localhost:' + PORT + '/')
})