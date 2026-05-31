// punto di ingresso dell'applicazione
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
const dns = require("dns");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
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

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error(
    "Errore: MONGODB_URI non è definito. Controlla il file .env nella radice del progetto.",
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
    app.listen(PORT, () => {
      console.log(`Il server è in ascolto sulla porta ${PORT}...`);
      console.log(`Testa la rotta su http://localhost:${PORT}/`);
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
        "Verifica la risoluzione DNS SRV per cluster0.fcvqwbl.mongodb.net e la configurazione di Network Access in MongoDB Atlas.",
      );
    }
  });
