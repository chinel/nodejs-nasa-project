const {
  getLaunches,
  scheduleNewLaunch,
  existLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");
const { getPagination } = require("../../services/query");

async function getAllLaunches(req, res) {
  const { limit, skip } = getPagination(req.query);
  const launches = await getLaunches(skip, limit);
  return res.status(200).json(launches);
}

async function addLaunch(req, res) {
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

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function abortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const existLaunch = await existLaunchWithId(launchId);
  //if launch does not exist
  if (!existLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  //if launch exist
  const aborted = await abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }
  return res.status(200).json({ ok: true });
}

module.exports = {
  getAllLaunches,
  addLaunch,
  abortLaunch,
};
