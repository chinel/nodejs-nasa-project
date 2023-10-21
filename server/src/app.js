const cors = require("cors");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const planetsRouter = require("./routes/planets/planets.router");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
); // if you don't pass any option it allow all origins
app.use(morgan("combined")); // combined is default format there are other formats, the common format is also used by Apache
app.use(express.json()); // this parses json from incoming request
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(planetsRouter);
app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
module.exports = app;
