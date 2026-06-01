const jwt = require("jsonwebtoken");
const Message = require("./models/Message");
const User = require("./models/User");

module.exports = (io) => {
  // Middleware di autenticazione JWT per Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      console.log("Connessione socket rifiutata: token mancante.");
      return next(new Error("Autenticazione fallita: token mancante."));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // Salva il payload decodificato { id: utenteId } nel socket
      next();
    } catch (err) {
      console.log("Connessione socket rifiutata: token non valido.");
      return next(new Error("Autenticazione fallita: token non valido."));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    console.log(`Utente connesso via socket: ${userId}`);

    // Ogni utente si unisce a una stanza chiamata come il proprio ID utente
    socket.join(userId);

    // Evento per l'invio di un messaggio real-time
    socket.on("invia_messaggio", async (data) => {
      try {
        const { destinatarioId, testo } = data;

        if (!destinatarioId || !testo) {
          console.warn("Ricevuto messaggio incompleto via socket:", data);
          return;
        }

        // 1. Salva il messaggio nel Database
        const nuovoMessaggio = new Message({
          mittente: userId,
          destinatario: destinatarioId,
          testo: testo.trim()
        });

        const messaggioSalvato = await nuovoMessaggio.save();

        // Popoliamo i dettagli essenziali del mittente e destinatario per il client
        const messaggioPopolato = await Message.findById(messaggioSalvato._id)
          .populate("mittente", "nome cognome email ruolo")
          .populate("destinatario", "nome cognome email ruolo");

        // 2. Invia in real-time al destinatario (se connesso) e rimanda anche al mittente
        // La stanza si chiama proprio come l'ID dei rispettivi utenti
        io.to(destinatarioId).emit("ricevi_messaggio", messaggioPopolato);
        io.to(userId).emit("ricevi_messaggio", messaggioPopolato);

        console.log(`Messaggio inviato da ${userId} a ${destinatarioId}`);
      } catch (error) {
        console.error("Errore nel salvataggio/invio del messaggio socket:", error.message);
      }
    });

    // Evento per aggiornare lo stato di lettura (quando un utente apre una chat)
    socket.on("segna_letti", async ({ mittenteId }) => {
      try {
        if (!mittenteId) return;

        // Segna come letti tutti i messaggi ricevuti da questo mittente per l'utente loggato
        const risultato = await Message.updateMany(
          { mittente: mittenteId, destinatario: userId, letto: false },
          { $set: { letto: true } }
        );

        if (risultato.modifiedCount > 0) {
          // Notifica il mittente originale che i suoi messaggi sono stati letti
          io.to(mittenteId).emit("messaggi_letti", { destinatarioId: userId });
          console.log(`Messaggi da ${mittenteId} segnati come letti da ${userId}`);
        }
      } catch (error) {
        console.error("Errore nel segnare messaggi come letti via socket:", error.message);
      }
    });

    // Evento indicatore di scrittura
    socket.on("typing", ({ destinatarioId, isTyping }) => {
      if (!destinatarioId) return;
      io.to(destinatarioId).emit("user_typing", { mittenteId: userId, isTyping });
    });

    socket.on("disconnect", () => {
      console.log(`Utente disconnesso socket: ${userId}`);
    });
  });
};
