/* routes/auth.js

// 1. REGISTRAZIONE UTENTE -> POST /api/auth/register
router.post('/register', async (req, res) => { ... });

// 2. LOGIN UTENTE -> POST /api/auth/login
router.post('/login', async (req, res) => { ... });

// 3. LOGOUT UTENTE -> POST /api/auth/logout
router.post('/logout', (req, res) => {
    // Se usi i cookie sicuri httpOnly per salvare il JWT, qui li cancelli:
    // res.clearCookie('token');
    
    res.status(200).json({ 
        messaggio: "Logout effettuato con successo. Sessione terminata." 
    });
});*/



//(La rotta Express per la registrazione)
// Questo file gestirà l'endpoint HTTP POST che il frontend React chiamerà per registrare un nuovo utente.

const express = require('express');
const router = express.Router();
const User = require('../models/User'); //importa il modello User per interagire con il DB

//Metodo POST per la registrazione di un nuovo utente
/**
 * @openapi
 * /auth/register:
 * post:
 * summary: Registra un nuovo utente (Studente o Host)
 * description: Crea un account nel database cifrando la password e salvando le preferenze.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - nome
 * - email
 * - password
 * - eta
 * - ruolo
 * properties:
 * nome:
 * type: string
 * example: "Davide Lanzo"
 * email:
 * type: string
 * example: "d.lanzo@studenti.poliba.it"
 * password:
 * type: string
 * example: "PasswordSicura123"
 * eta:
 * type: number
 * example: 21
 * ruolo:
 * type: string
 * example: "studente"
 * tagPreferenze:
 * type: array
 * items:
 * type: string
 * example: ["ordinato", "non-fumatore"]
 * responses:
 * 21:
 * description: Utente registrato con successo.
 * 400:
 * description: Campi obbligatori mancanti.
 */
router.post('/register', async (req, res) => {
    try {
        const {nome, email, password, eta, ruolo, tagPreferenze, bio} = req.body;

        //verifichiamo se l'utente esiste già
        const utenteEsistente = await User.findOne({email: req.body.email});
        if(utenteEsistente){
            return res.status(400).json({
                success: false,
                messaggio: "L'email è già registrata."
            });
        } 
        
        //creiamo un nuovo utente 

        const nuovoUtente = new User({nome, email, password, eta, ruolo, tagPreferenze, bio});
        await nuovoUtente.save();

        return res.status(201).json({
            success: true,
            messaggio: "Utente registrato con successo!",
            dati: nuovoUtente
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            messaggio: "Si è verificato un errore interno al server.",
            dettaglio: err.message
        });
    }
});

/**
 * @openapi
 * /auth/login:
 * post:
 * summary: Effettua il login di un utente
 * description: Verifica le credenziali dell'utente e restituisce un messaggio di successo (in futuro il Token JWT).
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * example: "d.lanzo@studenti.poliba.it"
 * password:
 * type: string
 * example: "PasswordSicura123"
 * responses:
 * 200:
 * description: Login effettuato con successo.
 * 401:
 * description: Credenziali errate.
 */
router.post('/login', async(req, res) => {
    try{
        //leggiamo email e password passate dal client
        const {email, password} = req.body;

        //cerchiarmo l'utente nel DB
        const utente = await User.findOne({email});

        if(!utente){
            return res.status(401).json({
                success: false,
                messaggio: "Utente non trovato. Verifica l'email o la password!"
            });
        }

        //se trova l'utente nel DB, verifichiamo la corrispondenda della password
        if(utente.password !== password){
            return res.status(401).json({
                success: false,
                messaggio: "Credenziali non valide. Verifica email e password!"
            })
        }

        //se invece sia email che password sono corretti procediamo

        return res.status(200).json({
            success: true,
            messaggio: "Login effettuato con successo!",
            utente: {
                id: utente._id,
                nome: utente.nome,
                email: utente.email,
                ruolo: utente.ruolo
            }
        });
    } catch (err){
        res.status(500).json({
            success: false,
            messaggio: "Si è verificato un errore interno al server.",
            dettaglio: err.message
        })
    }
});

module.exports = router;