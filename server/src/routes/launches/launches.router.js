const express = require("express");
const { getAllLaunches, addLaunch } = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", getAllLaunches);
launchesRouter.post("/", addLaunch);

module.exports = launchesRouter;
