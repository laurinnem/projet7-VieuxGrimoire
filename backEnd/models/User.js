const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//s'assure que l'email n'est pas déjà lié à un compte utilisateur
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
