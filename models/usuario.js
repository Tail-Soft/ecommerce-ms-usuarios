const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// Schema para los usuarioss
const Usuario = new Schema({
  nombres: {
    type: String,
    default: "",
    required: true,
  },
  apellidos: {
    type: String,
    default: "",
  },
  correo: {
    type: String,
    default: "",
    // Expresión regular para validación de correo
    match: "/.+@.+..+/",
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
    immutable: true,
  },
  direccion_envio: [
    {
      direccion: {
        type: String,
        required: True,
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

Usuario.plugin(passportLocalMongoose);

module.exports = mongoose.model("Usuario", Usuario);
