require("dotenv").config("../.env");
const { JWT_SECRET } = process.env;
const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models/modelsBeforeSplit");
const serverResponse = require("../utils/serverResponse");

const router = express.Router();

router.post("/login", (req, res) => {
  const { user, password } = req.body;
  if (password === "123") {
    const token = jwt.sign({ username, fullName }, JWT_SECRET);
    serverResponse(res, 200, { auth: true, token, err: undefined });
  } else {
    serverResponse(res, 401, { auth: false, err: "password incorrect" });
  }
  serverResponse(res, 200, token);
});

router.post("/register", (req, res) => {
  const { username, password, fullName } = req.body;
  const token = jwt.sign({ user }, JWT_SECRET);

  console.log();
});

router.post("/checkUser", (req, res) => {
  const { token } = req.body;
  try {
    const data = jwt.verify(token, JWT_SECRET);
    serverResponse(res, 200, data);
  } catch (e) {
    serverResponse(res, 500, { auth: false });
  }
});

module.exports = router;
