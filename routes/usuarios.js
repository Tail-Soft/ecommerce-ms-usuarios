const express = require("express");
const passport = require("passport");
const autenticacion = require("../services/autenticacion");

const cors = require("../services/cors");
const usuarioRouter = express.Router();

const {
  crearUsuario,
  iniciarSesion,
  cerrarSesion,
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
} = require("../controllers/usuarios");
const { authenticate } = require("passport");

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

// Rutas con id de usuario como parámetro
usuarioRouter
  .route("/:idUsuario")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  // Ruta para obtener un usuario específico
  .get(autenticacion.verifyUser, (req, res, next) => {
    obtenerUsuario(req, res, next);
  })
  // Esta operación no está permitida para esta ruta.
  .post(
    autenticacion.verifyUser,
    autenticacion.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end(
        `La operación POST no es soportada en la ruta /usuarios/${req.params.idUsuario}`
      );
    }
  )
  // Ruta para actualizar los datos de un usuario
  .put(autenticacion.verifyUser, (req, res, next) => {
    actualizarUsuario(req, res, next);
  })
  // Ruta para eliminar un usuario específico
  .delete(autenticacion.verifyUser, (req, res, next) => {
    eliminarUsuario(req, res, next);
  });

module.exports = usuarioRouter;
