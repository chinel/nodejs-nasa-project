const express = require("express");
const planetsRouter = require("./routes/planets/planets.router");

const app = express();

app.use(express.json()); // this parses json from incoming request
app.use(planetsRouter);

module.exports = app;
