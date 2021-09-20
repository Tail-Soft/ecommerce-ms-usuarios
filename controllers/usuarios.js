const Usuario = require("../models/usuario");
const passport = require("passport");
const autenticacion = require("../services/autenticacion");

function obtenerUsuarios(req, res, next) {
  Usuario.find({}, (err, usuarios) => {
    if (err) {
      return next(err);
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(usuarios);
    }
  });
}

function crearUsuario(req, res, next) {
  Usuario.register(
    // Parámetros requeridos deben ir dentro del nuevo usuario
    new Usuario({ correo: req.body.correo, nombres: req.body.nombres }),
    req.body.contraseña,
    (err, usuario) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ error: err });
        return;
      } else {
        // Parámetros opcionales se asignan si existen.
        if (req.body.apellidos) usuario.apellidos = req.body.apellidos;
        usuario.save((err, usuario) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ error: err });
            return;
          }
          passport.authenticate("local")(req, res, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, status: "Registro satisfactorio" });
          });
        });
      }
    }
  );
}

function iniciarSesion(req, res) {
  const token = autenticacion.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    token: token,
    status: "Has iniciado sesión correctamente",
  });
}

function cerrarSesion(req, res, next) {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    const err = new Error("Parece que no estás logeado");
    err.status = 403;
    next(err);
  }
}

module.exports = {
  crearUsuario,
  iniciarSesion,
  cerrarSesion,
  obtenerUsuarios,
};
