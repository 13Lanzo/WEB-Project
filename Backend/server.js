// punto di ingresso dell'applicazione
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const dns = require("dns");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(express.json());

// Configurazione CORS per consentire connessioni dal frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// -------------------------------------------------------------------------------------------------
// CONFIGURAZIONE SWAGGER (Caricato come da modello Esercitazione4)
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// -------------------------------------------------------------------------------------------------

// Importazione delle rotte
const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const roomsRoutes = require("./routes/roomsRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const healthRoutes = require("./routes/healthRoutes");

// Definizione dei path API coerentemente con il prefisso di versione di Esercitazione4 (/api/v1)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/rooms", roomsRoutes);
app.use("/api/v1/messages", messagesRoutes);
app.use("/health", healthRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ messaggio: "Server backend attivo e funzionante!" });
});

// Recupero URI del database MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error(
    "Errore: MONGODB_URI non è definito. Controlla il file .env nella radice del progetto.",
  );
  process.exit(1);
}

// Configurazione DNS per supportare la risoluzione dei record SRV di Atlas
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

// Creazione del server HTTP per integrare Express e Socket.io
const server = http.createServer(app);

// Connessione a MongoDB e avvio del server
mongoose
  .connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log("Connesso correttamente a MongoDB!");
  })
  .catch((err) => {
    console.error("Errore di connessione a MongoDB:", err);
    if (
      err.code === "ECONNREFUSED" ||
      err.name === "MongoServerSelectionError"
    ) {
      console.error(
        "Verifica la risoluzione DNS SRV e la configurazione di Network Access in MongoDB.",
      );
    }
  });
  
// Implementazione di Socket.io per la chat real-time
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const utentiConnessi = {};

io.on("connection", (socket) => {
  console.log("Nuovo utente connesso via socket:", socket.id);
  
  socket.on("registra_utente", (userId) => {
    utentiConnessi[userId] = socket.id;
    console.log(`Utente ${userId} associato al socket ${socket.id}`);
  });
  
  socket.on("invia_messaggio", (data) => {
    const socketDestinatario = utentiConnessi[data.destinatarioId];
    if (socketDestinatario) {
      io.to(socketDestinatario).emit("ricevi_messaggio", data);
    }
  });
  
  socket.on("disconnect", () => {
    for (const userId in utentiConnessi) {
      if (utentiConnessi[userId] === socket.id) {
        delete utentiConnessi[userId];
        break;
      }
    }
  });
});
const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Il server è in ascolto sulla porta ${PORT}...`);
      console.log(`Testa la rotta su http://localhost:${PORT}/`);
      console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
    });