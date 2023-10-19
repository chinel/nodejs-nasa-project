const { planets } = require("../../models/planets.model");

function getAllPlanets(req, res) {
  return res.status(200).json(planets); // the return keyword ensures that our function stops executing and only one response is sent, not all express code uses this pattern it helps to prevent unexpected bugs
}

module.exports = {
  getAllPlanets,
};
