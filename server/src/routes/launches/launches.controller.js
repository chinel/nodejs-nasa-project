const { getLaunches, addNewLaunch } = require("../../models/launches.model");

function getAllLaunches(req, res) {
  return res.status(200).json(getLaunches());
}

function addLaunch(req, res) {
  const launch = req.body;
  launch.launchDate = new Date(launch.launchDate);
  addNewLaunch(launch);
  return res.status(201).json(launch);
}

module.exports = {
  getAllLaunches,
  addLaunch,
};
