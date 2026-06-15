// Verifica se hai fatto l'accesso come proprietario

const soloProprietario = (req, res, next)=>{
    if (!req.user || req.user.ruolo!=='proprietario'){
        return res.status(403).json({
            success:false,
            messaggio: 'Accesso negato. Questa azione è riservata ai proprietari'
        });
    }
    next();
};
module.exports=soloProprietario;