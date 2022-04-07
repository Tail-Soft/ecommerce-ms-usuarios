const express = require("express");
const passport = require("passport");
const autenticacion = require("../services/autenticacion");
const Usuario = require("../models/usuario");

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

usuarioRouter
  .route("/verificar/:idUsuario")
  .get(cors.corsWithOptions, (req, res, next) => {
    Usuario.findById(req.params.idUsuario).then((usuario) => {
      if (usuario) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(usuario);
      } else {
        let err = new Error("Usuario no encontrado");
        err.status = 404;
        return next(err);
      }
    });
  });

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
  .post(autenticacion.verifyUser, autenticacion.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(
      `La operación POST no es soportada en la ruta /usuarios/${req.params.idUsuario}`
    );
  })
  // Ruta para actualizar los datos de un usuario
  .put(autenticacion.verifyUser, (req, res, next) => {
    actualizarUsuario(req, res, next);
  })
  // Ruta para eliminar un usuario específico
  .delete(autenticacion.verifyUser, (req, res, next) => {
    eliminarUsuario(req, res, next);
  });

// Ruta para direcciones de usuario
usuarioRouter
  .route("/direcciones/:idUsuario")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  // Obtiene el array de direcciones de envio del usuario
  .get(cors.cors, autenticacion.verifyUser, (req, res, next) => {
    Usuario.findById(req.params.idUsuario)
      .then(
        (usuario) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(usuario.direccion_envio);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  // Operación no permitida para esta ruta
  .post(autenticacion.verifyUser, autenticacion.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(
      `La operación POST no es soportada en la ruta /direcciones/${req.params.idUsuario}`
    );
  })
  //Añade y actualiza el array de direcciones
  .put(
    autenticacion.verifyUser,
    autenticacion.verifyAdmin,
    (req, res, next) => {
      Usuario.findByIdAndUpdate(
        req.params.idUsuario,
        {
          $push: { direccion_envio: req.body },
        },
        { new: true }
      )
        .then(
          (direcciones) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(direcciones);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )
  // Elimina todas las direcciones del usuario (No permitida)
  .delete(autenticacion.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `La operación POST no es soportada en la ruta /direcciones/${req.params.idUsuario}`
    );
  });

module.exports = usuarioRouter;
