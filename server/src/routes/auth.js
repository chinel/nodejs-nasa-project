const express = require("express");

const auth = express.Router();

auth.get("/google", (req, res) => {});
auth.get("/google/callback", (req, res) => {});
auth.get("/logout", (req, res) => {});

module.exports = auth;
