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
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Uniroom API Documentazione",
      version: "1.0.0",
      description:
        "Documentazione ufficiale delle API REST per la piattaforma UniRoom" +
        "\n\nrealizzato da Giuseppe, Francesca e Pierpaolo",
      contact: {
        name: "Giuseppe, Francesca e Pierpaolo",
      },
    },
    servers: [
      {
        url: "http://localhost:" + process.env.PORT,
        description: "Server di Sviluppo Locale",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Inserisci il tuo token JWT per autorizzare le chiamate.",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // indichiamo a swagger dove andare a cercare i commenti da documentare
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Creazione dell'endpoint per la dashboard grafica
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// -------------------------------------------------------------------------------------------------

const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const roomsRoutes = require("./routes/roomsRoutes");
const messagesRoutes = require("./routes/messagesRoutes");

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/rooms", roomsRoutes);
app.use("/messages", messagesRoutes);

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
