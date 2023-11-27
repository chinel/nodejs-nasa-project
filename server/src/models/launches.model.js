const axios = require("axios");
const launchesDatabase = require("./launches.mongo");
const planetsDatabase = require("./planets.mongo");
const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

/*const launch = {
  flightNumber: 100, //flight_number
  mission: "Keepler Exploration X", //name
  rocket: "Explorer IS1", //rocket.name
  launchDate: new Date("December 27, 2030"), //date_local
  target: "Kepler-442 b", // not applicable
  customers: ["ZTM", "NASA"], // payload.customers for each customer
  upcoming: true, //upcoming
  success: true, //success
};
*/

//saveLaunch(launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

//launches.set(launch.flightNumber, launch);

async function populateLaunches() {
  console.log("Downloading launch data...");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payload = launchDoc["payloads"];
    const customers = payload.flatMap((payload) => {
      return payload["customers"];
    });
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"], //date_local
      customers,
      upcoming: launchDoc["upcoming"], //upcoming
      success: launchDoc["success"], //success
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);
    //TODO: populate launches collection
    await saveLaunch(launch);
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Launch Data, already loaded");
  } else {
    await populateLaunches();
  }
}

async function findLaunch(launch) {
  return await launchesDatabase.findOne(launch);
}

async function existLaunchWithId(launchId) {
  return await findLaunch({ flightNumber: launchId });
}

async function getLastestFlightNumber() {
  const lastestLaunch = await launchesDatabase.findOne().sort("-flightNumber");

  if (!lastestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return lastestLaunch.flightNumber;
}

async function getLaunches(skip, limit) {
  // return Array.from(launches.values());
  return await launchesDatabase
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch = launch) {
  await launchesDatabase.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

async function scheduleNewLaunch(launch) {
  const planet = await planetsDatabase.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  const newFlightNumber = (await getLastestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ["ZTM", "NASA"],
    upcoming: true,
    success: true,
  });

  await saveLaunch(newLaunch);
}

// function addNewLaunch(launch) {
//   //latestFlightNo += 1; // or latestFlightNo++ for short
//   launches.set(
//     latestFlightNo,
//     Object.assign(launch, {
//       flightNumber: latestFlightNo,
//       customers: ["ZTM", "NASA"],
//       upcoming: true,
//       success: true,
//     })
//   );
// }

async function abortLaunchById(launchId) {
  // launches.delete(launchId);
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      success: false,
      upcoming: false,
    }
  );
  console.log("aborted", aborted);
  return aborted.acknowledged && aborted.matchedCount === 1;
  // const aborted = launches.get(launchId);
  // aborted.success = false;
  // aborted.upcoming = false;
  // return aborted;
}

module.exports = {
  loadLaunchesData,
  getLaunches,
  scheduleNewLaunch,
  existLaunchWithId,
  abortLaunchById,
};
