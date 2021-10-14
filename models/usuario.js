const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// Schema para los usuarioss
const Usuario = new Schema({
  nombres: {
    type: String,
    trim: true,
    required: true,
  },
  apellidos: {
    type: String,
    default: " ",
  },
  correo: {
    type: String,
    index: true,
    unique: true,
    // Expresión regular para validación de correo
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Por favor, ingresa un correo valido.",
    ],
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  direccion_envio: [
    {
      direccion: {
        type: String,
        required: true,
      },
      descripcion: {
        type: String,
      },
      ciudad: {
        type: String,
        default: "Medellín",
        required: true,
      },
      sector: {
        type: String,
        required: true,
      },
    },
  ],
});

/**
 * Se especifican los campos a utilizar con passport, cambiando
 * asignando el correo como username y la contraseña como password.
 */
Usuario.plugin(passportLocalMongoose, {
  usernameField: "correo",
  passwordField: "contraseña",
});

module.exports = mongoose.model("Usuario", Usuario);
