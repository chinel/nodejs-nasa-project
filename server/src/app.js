const cors = require("cors");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const api = require("./routes/api");
const auth = require("./routes/auth");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");

const app = express();

const config = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

const AUTH_OPTIONS = {
  callbackURL: "/auth/google/callback",
  clientId: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
};

function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log("Google Profile", profile);
  done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
); // if you don't pass any option it allow all origins

app.use(passport.initialize());
app.use(morgan("combined")); // combined is default format there are other formats, the common format is also used by Apache
app.use(express.json()); // this parses json from incoming request
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1", api);

function checkLoggedIn(req, res, next) {
  const isLoggedIn = true; //TODO
  if (!isLoggedIn) {
    return res.status(401).json({
      error: "You must log in",
    });
  }

  next();
}

app.use("/auth", auth);
app.use("/*", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
module.exports = app;
