const fs = require("fs");
const path = require("path");
const parse = require("csv-parse");

const planets = require("./planets.mongo");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

/**
 * const promise = new Promise ((resolve, reject)=>{
 * resolve(42);
 * or just resolve();
 * });
 * promise.then((result)=>{
 * // do something with the result
 * }) ;
 *
 * or if you want to use await
 * const result = await promise;
 *
 * console.log(promise)
 *
 */

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv") // __dirname is current directory which is models, then you have to go back 2 levels then data folder in the second level then the file name
    )
      .pipe(
        parse.parse({
          comment: "#", // we want to treat line that starts with # as comments
          columns: true, // returns a javascript object with key, value pair, rather than just an array of the values in our row
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          //TODO: replace below create with insert + update = upsert
          await savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log("err", err);
        reject(err);
      })
      .on("end", async () => {
        const countPlanetsFound = (await getPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found!`);
        console.log("done");
        resolve();
      });
  });
}

async function getPlanets() {
  return await planets.find({});
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      { keplerName: planet.kepler_name },
      { keplerName: planet.kepler_name },
      { upsert: true }
    );
  } catch (error) {
    console.error(`Could not save planet ${error}`);
  }
}

module.exports = {
  loadPlanetsData,
  getPlanets,
};
