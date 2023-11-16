const monoogse = require("mongoose");

const planetsSchema = new monoogse.Schema({
  keplerName: { type: String, required: true },
});

module.exports = monoogse.model("Planet", planetsSchema);
