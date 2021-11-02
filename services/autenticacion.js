const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Usuario = require("../models/usuario");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");

/**
 * Se crea una estrategia local para la autenticación del usuario.
 * Es necesario especificar que el campo del nombre de usuario será
 * el correo proporcionado, igualmente con el campo de la contraseña.
 */

exports.local = passport.use(
  new LocalStrategy(
    {
      usernameField: "correo",
      passwordField: "contraseña",
    },
    Usuario.authenticate()
  )
);

// Determina cuales datos del objeto usuario deben almacenarse en la sesión
passport.serializeUser(Usuario.serializeUser());

// Obtiene el usuario de la sesión
passport.deserializeUser(Usuario.deserializeUser());

// Función para obtener el token de usuario usando JWT y una Secret key
exports.getToken = function (usuario) {
  return jwt.sign(usuario, process.env.SECRET_KEY, { expiresIn: 3600 });
};

// Opciones para la estrategia de JWT
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

//Método para obtener el usuario usando la estrategia JWT
exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    Usuario.findOne({ _id: jwt_payload._id }, (err, usuario) => {
      if (err) {
        return done(err, false);
      } else if (usuario) {
        return done(null, usuario);
      } else {
        return done(null, false);
      }
    });
  })
);

// Sesión deshabilitada, se requiren credenciales para realizar la petición.
exports.verifyUser = passport.authenticate("jwt", { session: false });

// Verifica si el usuario es un administrador
exports.verifyAdmin = function (req, res, next) {
  if (req.user.admin) {
    next();
  } else {
    const err = new Error("No tienes permitido realizar esta operación.");
    err.status = 403;
    next(err);
  }
};
