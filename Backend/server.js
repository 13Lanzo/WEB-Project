// Punto di ingresso dell'applicazione con Socket.IO
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const dns = require("dns");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// -------------------------------------------------------------------------------------------------
// CONFIGURAZIONE SWAGGER
const setupSwagger = require("./swagger");
setupSwagger(app);
// -------------------------------------------------------------------------------------------------

const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const roomsRoutes = require("./routes/roomsRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const healthRoutes = require("./routes/healthRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/health", healthRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ messaggio: "Server backend attivo e funzionante!" });
});

// -------------------------------------------------------------------------------------------------
// CONFIGURAZIONE SOCKET.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Mappa userId (MongoDB ObjectId string) → socketId
const utentiConnessi = {};

io.on("connection", (socket) => {
  console.log(`[Socket.IO] Nuovo client connesso: ${socket.id}`);

  // L'utente si registra con il proprio userId dopo il login
  socket.on("registra_utente", (userId) => {
    utentiConnessi[userId] = socket.id;
    console.log(`[Socket.IO] Utente registrato: ${userId} → ${socket.id}`);
  });

  // Ricezione e inoltro messaggio privato real-time
  socket.on("invia_messaggio", (data) => {
    // data = { mittenteId, destinatarioId, testo, mittenteNome, createdAt }
    const socketDestinatario = utentiConnessi[data.destinatarioId];
    if (socketDestinatario) {
      io.to(socketDestinatario).emit("ricevi_messaggio", data);
      console.log(`[Socket.IO] Messaggio inoltrato a ${data.destinatarioId}`);
    } else {
      console.log(`[Socket.IO] Destinatario ${data.destinatarioId} non connesso (verrà recuperato alla prossima apertura)`);
    }
  });

  // Notifica che un messaggio è stato letto
  socket.on("messaggio_letto", (data) => {
    // data = { mittenteId, destinatarioId }
    const socketMittente = utentiConnessi[data.mittenteId];
    if (socketMittente) {
      io.to(socketMittente).emit("messaggio_letto_conferma", { destinatarioId: data.destinatarioId });
    }
  });

  socket.on("disconnect", () => {
    // Rimuovi l'utente dalla mappa quando si disconnette
    for (const [uid, sid] of Object.entries(utentiConnessi)) {
      if (sid === socket.id) {
        delete utentiConnessi[uid];
        console.log(`[Socket.IO] Utente disconnesso: ${uid}`);
        break;
      }
    }
  });
});
// -------------------------------------------------------------------------------------------------

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error(
    "Errore: MONGODB_URI non è definito. Controlla il file .env nella radice del progetto."
  );
  process.exit(1);
}

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
  console.log("Usando DNS pubblici per la risoluzione SRV:", dns.getServers());
} catch (dnsErr) {
  console.warn("Impossibile impostare DNS pubblici per SRV:", dnsErr.message);
}

const mongooseOptions = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  family: 4,
};

mongoose
  .connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Il server è in ascolto sulla porta ${PORT}...`);
      console.log(`Testa la rotta su http://localhost:${PORT}/`);
      console.log(`Socket.IO attivo sulla porta ${PORT}`);
    });
    console.log("Connesso correttamente a MongoDB Atlas!");
  })
  .catch((err) => {
    console.error("Errore di connessione a MongoDB Atlas:", err);
    if (
      err.code === "ECONNREFUSED" ||
      err.name === "MongoServerSelectionError"
    ) {
      console.error(
        "Verifica la risoluzione DNS SRV e la configurazione di Network Access in MongoDB Atlas."
      );
    }
  });
