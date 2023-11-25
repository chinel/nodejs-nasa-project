const express = require("express");
const planetsRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");

const api = express.Router();
api.use(planetsRouter);
api.use("/launches", launchesRouter); // you can pass the path here or leave it like the planets router

module.exports = api;
