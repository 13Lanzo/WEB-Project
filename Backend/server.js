//punto di ingresso dell'applicazione

//1. carica le variabili dal file .env all'avvio del processo
require('dotenv').config();

const epxress = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//2. Richiama la variabile di ambiente per la connessione a MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;

//3. Usa la costante per la connesione al could
mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connesso correttamente a MongoDB Atlas!"))
    .catch((err) => console.error("Errore di connessione a MongoDB Atlas:", err.message));