const launchesDatabase = require("./launches.mongo");
const launches = new Map();

let latestFlightNo = 100;

const launch = {
  flightNumber: 100,
  mission: "Keepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Keepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

//launches.set(launch.flightNumber, launch);

function existLaunchWithId(launchId) {
  return launches.has(launchId);
}

function getLaunches() {
  return Array.from(launches.values());
}

async function saveLaunch(launch) {
  await launchesDatabase.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

function addNewLaunch(launch) {
  latestFlightNo += 1; // or latestFlightNo++ for short
  launches.set(
    latestFlightNo,
    Object.assign(launch, {
      flightNumber: latestFlightNo,
      customers: ["ZTM", "NASA"],
      upcoming: true,
      success: true,
    })
  );
}

function abortLaunchById(launchId) {
  // launches.delete(launchId);
  const aborted = launches.get(launchId);
  aborted.success = false;
  aborted.upcoming = false;
  return aborted;
}

module.exports = {
  getLaunches,
  addNewLaunch,
  existLaunchWithId,
  abortLaunchById,
};
