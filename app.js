require("raygun-apm/http");
const raygun = require("raygun");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv");
require("http");
const airbreak = require("@airbrake/node");

// airbrake
process.env.NODE_ENV === "production" &&
  new airbreak.Notifier({
    projectId: 409701,
    projectKey: "cd6ca1aa7afa25280cbdd6ca7dde329c",
    environment: "production",
  });

dotenv.config();

const raygunClient = new raygun.Client().init({
  apiKey: process.env.RAYGUN_API_KEY,
  reportUncaughtExceptions: true,
  batch: true,
});

// Espacio para rutas
const usuarioRouter = require("./routes/usuarios");

// Variables de entorno
const { MONGO_KEY, MONGO_KEY_TEST, NODE_ENV } = process.env;

const connectionString =
  NODE_ENV === "development" ? MONGO_KEY : MONGO_KEY_TEST;

// Conexión Mongo DB
const connect = mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Verificación de conexión
connect
  .then(() => {
    console.log(
      `Conectado correctamente al servidor en el entorno ${NODE_ENV}`
    );
  })
  .catch((err) => {
    raygunClient.send(err);
  });

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

const server = app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});

module.exports = { app, server };
