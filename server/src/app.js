const cors = require("cors");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const api = require("./routes/api");
const auth = require("./routes/auth");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
); // if you do not pass any option it allow all origins

app.use(morgan("combined")); // combined is default format there are other formats, the common format is also used by Apache
app.use(express.json()); // this parses json from incoming request
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1", api);

app.use("/auth", auth);
app.use("failure", (req, res) => {
  return res.send("Failed to log in!");
});
app.use("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
module.exports = app;
