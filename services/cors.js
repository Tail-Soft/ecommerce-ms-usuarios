const express = require("express");
const cors = require("cors");

// TODO: Cambiar rutas en producción.

const whiteList = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:3004",
  "http://localhost:3005",
];
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
