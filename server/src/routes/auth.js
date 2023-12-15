const express = require("express");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const cookieSession = require("cookie-session");
const app = express();

const auth = express.Router();

const config = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

const AUTH_OPTIONS = {
  callbackURL: "/auth/google/callback",
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
};

function checkLoggedIn(req, res, next) {
  //Passport will add an extra field to req called user which
  // contains the information of the logged in user, if the user is logged in
  const isLoggedIn = req.isAuthenticated() && req.user; // using both gives us extra confidence
  if (!isLoggedIn) {
    return res.status(401).json({
      error: "You must log in",
    });
  }

  next();
}

function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log("Google Profile", profile);
  done(null, profile);
}

//Save the session to the cookie
passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

//Read the session from the cookie
passport.serializeUser((user, done) => {
  //here we can limit the data we want to serailize, we can just select id, it depends on your usecase
  done(null, user.id);
});

passport.deserializeUser((/*obj*/ id, done) => {
  //and since we are receiveing the id, we can change the parameter name to id
  done(null, obj);
});
app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    key: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
  })
);

app.use(passport.initialize());
app.use(passport.session()); //passport authenticates the session that is being sent to the server using the secret keys
auth.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email"], // you can also pass profile if you want to
  })
);
//the passport middleware will handle all the authorization code that google sends back
auth.get(
  "/google/callback",
  passport.authenticate(
    "google",
    {
      failureRedirect: "/failure",
      successRedirect: "/",
      session: true, // this is set to true by default
    },
    (req, res) => {
      //here we can res.redirect(); if we don't want to use failureRedirect or successRedirect
    }
  )
);
auth.get("/secret", checkLoggedIn, (req, res) => {});
auth.get("/logout", (req, res) => {
  req.logout(); //Removes req.user and clears any logged in session of that user
  res.redirect("/");
});

module.exports = auth;
