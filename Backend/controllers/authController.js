const jwt = require('jsonwebtoken');
const User = require('../models/User'); //importa il modello User per interagire con il DB

async function register(req, res) {
    try {
            console.log("[Auth] Richiesta registrazione ricevuta:", req.body);
            const {nome, cognome, email, password, eta, ruolo, tagPreferenze, bio} = req.body;
            
            if (!email) {
                return res.status(400).json({ success: false, messaggio: "L'email è obbligatoria." });
            }

            const emailNormalizzata = email.toLowerCase().trim();
            //verifichiamo se l'utente esiste già
            const utenteEsistente = await User.findOne({email: emailNormalizzata});
            if(utenteEsistente){
                console.log("[Auth] Registrazione fallita: email già esistente:", emailNormalizzata);
                return res.status(400).json({
                    success: false,
                    messaggio: "L'email è già registrata."
                });
            } 
            
            //creiamo un nuovo utente 
            const nuovoUtente = new User({nome, cognome, email: emailNormalizzata, password, eta, ruolo, tagPreferenze, bio});
            await nuovoUtente.save();
            console.log("[Auth] Utente registrato con successo:", emailNormalizzata);
    
            return res.status(201).json({
                success: true,
                messaggio: "Utente registrato con successo!",
                dati: nuovoUtente
            });
    
    } catch (err) {
        console.error("[Auth] Errore durante la registrazione:", err);
        res.status(500).json({
            success: false,
            messaggio: "Si è verificato un errore interno al server.",
            dettaglio: err.message
        });
    }
}

async function login(req, res) {
try{
        console.log("[Auth] Richiesta login ricevuta per:", req.body.email);
        //leggiamo email e password passate dal client
        const {email, password} = req.body;

        if (!email) {
            return res.status(400).json({ success: false, messaggio: "L'email è obbligatoria." });
        }

        const emailNormalizzata = email.toLowerCase().trim();
        //cerchiarmo l'utente nel DB
        const utente = await User.findOne({email: emailNormalizzata});

        if(!utente){
            console.log("[Auth] Login fallito: utente non trovato:", emailNormalizzata);
            return res.status(401).json({
                success: false,
                messaggio: "Utente non trovato. Verifica l'email o la password!"
            });
        }

        //se trova l'utente nel DB, verifichiamo la corrispondenda della password cifrata
        const isMatch = await utente.comparePassword(password);
        if(!isMatch){
            console.log("[Auth] Login fallito: password errata per:", emailNormalizzata);
            return res.status(401).json({
                success: false,
                messaggio: "Credenziali non valide. Verifica email e password!"
            });
        }

        //creo le jwt

        const payload = {id: utente._id};

        //firmiamo il toker
        const jwtSecretKey = process.env.JWT_SECRET; //prende la chiave segreta per cifrare il token dal file .env
        const token = jwt.sign(payload, jwtSecretKey, {expiresIn: '24h'});

        console.log("[Auth] Login completato con successo per:", emailNormalizzata);

        return res.status(200).json({
            success: true,
            messaggio: "Login effettuato con successo!",
            token: token,
            utente: {
                id: utente._id,
                nome: utente.nome,
                email: utente.email,
                ruolo: utente.ruolo
            }
        });
    } catch (err){
        console.error("[Auth] Errore durante il login:", err);
        res.status(500).json({
            success: false,
            messaggio: "Si è verificato un errore interno al server.",
            dettaglio: err.message
        })
    }
}

module.exports = {
    register, 
    login
};