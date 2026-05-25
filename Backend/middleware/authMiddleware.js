const jwt = require('jsonwebtoken');

const verificaToken = (req, res, next) => {
    //estraiamo dall'header della richiesta il token
    const authHeader = req.headers['authorization'];

    //recupero la parte cifrata del token scartando Bearer
    const token = authHeader && authHeader.split(' ')[1];

    //verifichiamo il token non esiste e nel caso mandamo un messaggio di errore

    if(!token){
        return res.status(401).json({
            success: false,
            messaggio: "Token mancante"
        });
    }

    //se il token esiste
    try{
        //verifichiamo se il token è stato alterato
        const datiDecifrati = jwt.verify(token, process.env.JWT_SECRET);

        req.user = datiDecifrati;

        next();
    } catch (err) {
        //caso in cui il token è scaduto o modificato
        return res.status(403).json({
            success: false,
            messaggio: "Token scaduto o taroccato"
        })
    }
}