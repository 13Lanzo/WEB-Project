const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true, // Rimuove spazi bianchi all'inizio e alla fine del nome
    },
    cognome: {
        type: String,
        required: true,
        trim: true, 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Converte l'email in minuscolo per evitare duplicati
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    eta: {
      type: Number,
      required: true,
      min: 18, // Età minima per registrarsi
      max: 100, // Età massima per registrarsi
      // gestire l'errore in caso di età!
    },
    ruolo: {
      type: String,
      required: true,
      enum: ["inquilino", "proprietario"], // Accetta solo uno di questi  valori
      default: "inquilino", // Se non specificato, assume che sia uno studente
    },
    facolta:{
      type:String,
      default: '',
    },
    tagPreferenze: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      maxlength: 500, // Limita la lunghezza della biografia
    },
  },
  {
    timestamps: true, // Aggiunge automaticamente createdAt e updatedAt nel database
  },
);

// Cifratura della password prima del salvataggio nel database
UserSchema.pre("save", async function () {
  // Esegui la cifratura solo se la password è stata modificata (o è nuova)
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // genera hash diverse per utenti che hanno la stessa password
  } catch (err) {
    throw err;
  }
});

// Metodo di istanza per verificare la password inserita con quella cifrata
UserSchema.methods.comparePassword = async function (passwordInserita) {
  return await bcrypt.compare(passwordInserita, this.password);
};

module.exports = mongoose.model("User", UserSchema);
