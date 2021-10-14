const express = require("express");
const cors = require("cors");

// TODO: Cambiar rutas en producción.
const whiteList = ["http://localhost:3000", "https://localhost:3001"];
const corsOptionsDeletage = (req, callback) => {
  var corsOptions;

  if (whiteList.indexOf(req.header("Origin")) !== -1) {
    corsOptions = {
      origin: true,
    };
  } else {
    corsOptions = {
      origin: false,
    };
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDeletage);
