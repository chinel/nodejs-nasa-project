const {
  getLaunches,
  addNewLaunch,
  existLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");

function getAllLaunches(req, res) {
  return res.status(200).json(getLaunches());
}

function addLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.target ||
    !launch.launchDate
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }
  launch.launchDate = new Date(launch.launchDate);

  if (launch.launchDate.toString() === "Invalid Date") {
    return res.status(400).json({
      error: "Invalid lauch date",
    });
  }

  addNewLaunch(launch);
  return res.status(201).json(launch);
}

function abortLaunch(req, res) {
  const launchId = Number(req.params.id);

  //if launch does not exist
  if (!existLaunchWithId(launchId)) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  //if launch exist
  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted);
}

module.exports = {
  getAllLaunches,
  addLaunch,
  abortLaunch,
};
