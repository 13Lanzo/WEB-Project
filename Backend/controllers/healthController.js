// Metodo per gestire la richiesta di health check
function healthCheck(req,res) {
    res.json({ messagge: "Server attivo e funzionante!" });
}

module.exports = { healthCheck };