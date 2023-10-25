const launches = new Map();

let latestFlightNo = 100;

const launch = {
  flightNumber: 100,
  mission: "Keepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  destination: "Keepler-442 b",
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  latestFlightNo += 1; // or latestFlightNo++ for short
  launches.set(
    latestFlightNo,
    Object.assign(launch, {
      flightNumber: latestFlightNo,
      customer: ["ZTM", "NASA"],
      upcoming: true,
      success: true,
    })
  );
}

module.exports = {
  getLaunches,
  addNewLaunch,
};
