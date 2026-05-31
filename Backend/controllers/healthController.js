/**
 * Health Controller
 * questo controller è responsabile di gestire le richieste relative alla salute del server e del database.
 * Fornisce un semplice endpoint che può essere utilizzato per verificare lo stato di salute dell'app.
 */

// Metodo per gestire la richiesta di health check
function healthCheck(req,res) {
    res.json({ messagge: "Server attivo e funzionante!" });
}

module.exports = { healthCheck };