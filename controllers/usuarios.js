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

function obtenerUsuario(req, res, next) {
  /* Solo el usuario al cual pertenece la cuenta o un
   * administrador puede consutal su información.
   */
  if (req.user._id.equals(req.params.userId) || req.user.admin) {
    Usuario.findById(req.params.idUsuario)
      .then(
        (usuario) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(usuario);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  } else {
    res.statusCode = 403;
    res.end(`No puedes consultar la información de este usuario`);
  }
}

function actualizarUsuario(req, res, next) {
  /* Solo el usuario al cual pertenece la información o un
   * administrador puede actualizarla.
   */
  if (req.user._id.equals(req.params.idUsuario) || req.user.admin) {
    // Evita que el usuario actualice su rol
    delete req.body.admin;
    Usuario.findByIdAndUpdate(
      req.params.idUsuario,
      {
        $set: req.body,
      },
      { new: true }
    ).then(
      (usuario) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(usuario);
      },
      (err) => next(err)
    );
  } else {
    res.statusCode = 403;
    res.end(`No puedes actualizar la información de este usuario`);
  }
}

function eliminarUsuario(req, res, next) {
  /* Solo el usuario al cual pertenece la cuenta o un
   * administrador puede eliminarla.
   */
  if (req.user._id.equals(req.params.idUsuario) || req.user.admin) {
    Usuario.findByIdAndRemove(req.params.idUsuario)
      .then(
        (response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  } else {
    res.statusCode = 403;
    res.end(`No tienes permiso para eliminar este usuario`);
  }
}

module.exports = {
  crearUsuario,
  iniciarSesion,
  cerrarSesion,
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
