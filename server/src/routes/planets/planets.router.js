const express = require("express");
const { getAllPlanets } = require("./planets.controller");

const planetsRouter = express.Router();

//Define all planets routes
planetsRouter.get("/planets", getAllPlanets);

module.exports = planetsRouter;
