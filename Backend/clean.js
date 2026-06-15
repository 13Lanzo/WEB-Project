// Import Mongoose library to connect to MongoDB and perform database operations
const mongoose = require("mongoose");
const path = require("path");
const dns = require("dns");

// Load environment variables from a .env file into process.env
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

// Import the User, Room, and Message models to perform delete operations on their 
// respective collections
const User = require("./models/User");
const Room = require("./models/Room");
const Message = require("./models/Message");

// Configurazione DNS per supportare la risoluzione dei record SRV di Atlas in ambienti locali
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (dnsErr) {
  console.warn("Impossibile impostare DNS pubblici per SRV:", dnsErr.message);
}

// This function connects to the MongoDB database, deletes all documents from the User, 
// Room, and Message collections, and then closes the database connection. It also logs 
// the number of deleted documents for each collection.
async function clean() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI non è definita nel file .env!");
    }

    // Connect to the MongoDB database using the connection string from environment variables
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      family: 4,
    });

    console.log(`Connesso a: ${mongoose.connection.host} (db: ${mongoose.connection.name})`);

    // Delete all documents from the User, Room, and Message collections
    const u = await User.deleteMany({});
    const r = await Room.deleteMany({});
    const m = await Message.deleteMany({});
    console.log(`Eliminati → utenti: ${u.deletedCount}, stanze: ${r.deletedCount}, messaggi: ${m.deletedCount}`);
    console.log("Database svuotato.");

    // Close the database connection after the operations are complete
    await mongoose.connection.close();
  } catch (error) {
    console.error("Clean error:", error.message);
    process.exit(1);
  }
}

clean();
