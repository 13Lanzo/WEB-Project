const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
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
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    eta: {
      type: Number,
      required: true,
      min: 18,
      max: 100,
    },
    ruolo: {
      type: String,
      required: true,
      enum: ["inquilino", "proprietario"],
      default: "inquilino",
    },
    // Solo per inquilini: facoltà universitaria o tipo di impiego
    facolta: {
      type: String,
      default: "",
    },
    tagPreferenze: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Cifratura della password prima del salvataggio
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

// Metodo per verificare la password
UserSchema.methods.comparePassword = async function (passwordInserita) {
  return await bcrypt.compare(passwordInserita, this.password);
};

module.exports = mongoose.model("User", UserSchema);
