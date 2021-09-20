const express = require("express");
const Usuario = require("../models/usuario");
const passport = require("passport");
const autenticacion = require("../services/autenticacion");

const cors = require("../services/cors");
const usuarioRouter = express.Router();

const {
  crearUsuario,
  iniciarSesion,
  cerrarSesion,
  obtenerUsuarios,
} = require("../controllers/usuarios");

// Obtiene todos los usuarios
usuarioRouter.get(
  "/",
  cors.corsWithOptions,
  autenticacion.verifyUser,
  autenticacion.verifyAdmin,
  (req, res, next) => {
    obtenerUsuarios(req, res, next);
  }
);

// Ruta para crear un usuario
usuarioRouter.post("/signup", cors.corsWithOptions, (req, res, next) => {
  crearUsuario(req, res, next);
});

// Ruta para el inicio de sesión de un usuario
usuarioRouter.post(
  "/login",
  passport.authenticate("local"),
  cors.corsWithOptions,
  (req, res) => {
    iniciarSesion(req, res);
  }
);

// Ruta para cerrar sesión
usuarioRouter.get(
  "/logout",
  cors.corsWithOptions,
  autenticacion.verifyUser,
  (req, res, next) => {
    cerrarSesion(req, res, next);
  }
);

module.exports = usuarioRouter;
