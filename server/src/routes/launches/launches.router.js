const express = require("express");
const {
  getAllLaunches,
  addLaunch,
  abortLaunch,
} = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", getAllLaunches);
launchesRouter.post("/", addLaunch);
launchesRouter.delete("/:id", abortLaunch);

module.exports = launchesRouter;
