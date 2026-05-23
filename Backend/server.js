
require('dotenv').config(); //carica le variabili dal file .env
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json()); //permette di leggere i dati JSON inviati dalle richieste 

//impostiamo le rotte
const registerUserRoute = require('./routes/registrazioneUtente'); 
const loginUserRoute = require('./routes/login');

app.use('/registrazione', registerUserRoute); //tutte le rotte di registrazioneUtente.js inizieranno con /registrazione
app.use('/login', loginUserRoute); //tutte le rotte di login.js inizieranno con /login

//verifichiamo la rotta di test
app.get('/', (req, res) => {
    res.status(200).json({messaggio: "Server backend attivo e funzionante!"});
});

//connettiamo il db

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Connesso correttamente a MongoDB Atlas!")
    })
    .catch((err) => {
        console.error("Errore di connessione a MongoDB Atlas:", err.message)
    });

//avvio del server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Il server è in ascolto sulla porta ${PORT}...`);
    console.log(`Testa la rotta su http://localhost:${PORT}/`);
});
