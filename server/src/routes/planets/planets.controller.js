const { getPlanets } = require("../../models/planets.model");

async function getAllPlanets(req, res) {
  return res.status(200).json(await getPlanets()); // the return keyword ensures that our function stops executing and only one response is sent, not all express code uses this pattern it helps to prevent unexpected bugs
}

module.exports = {
  getAllPlanets,
};
