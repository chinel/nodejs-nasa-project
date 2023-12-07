const express = require("express");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");

const auth = express.Router();

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

app.use(passport.initialize());
auth.get("/google", (req, res) => {});
auth.get("/google/callback", passport.authenticate("google"), {
  failureRedirect: "/failure",
  successRedirect: "/",
});
auth.get("/logout", (req, res) => {});

module.exports = auth;
