// Middleware che verifica che l'utente loggato abbia ruolo "proprietario"
// Da usare dopo verificaToken nelle rotte riservate ai proprietari

const soloProprietario = (req, res, next) => {
    if (!req.user || req.user.ruolo !== 'proprietario') {
        return res.status(403).json({
            success: false,
            messaggio: "Accesso negato. Questa funzionalità è riservata ai proprietari."
        });
    }
    next();
};

module.exports = soloProprietario;
