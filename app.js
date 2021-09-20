const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();

// Espacio para rutas
const usuarioRouter = require("./routes/usuarios");

// Conexión Mongo DB
const connect = mongoose.connect(process.env.MONGO_KEY, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Verificación de conexión
connect.then(() => {
  console.log("Conectado correctamente al servidor");
}),
  (err) => {
    console.log(err);
  };

const app = express();

// Configuración de la API.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cors());
app.use(passport.initialize());

// Definición en ruta principal
app.get("/", (req, res) => {
  res.send("Ecommerce API");
});

// Espacio para uso de rutas
app.use("/usuarios", usuarioRouter);

// Puertos
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});

module.exports = app;
