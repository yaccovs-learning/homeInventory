require("dotenv").config("../.env");
const { JWT_SECRET } = process.env;
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const serverResponse = require("../utils/serverResponse");
const { User } = require("../models/modelsBeforeSplit");
const { body, validationResult } = require("express-validator");

const router = express.Router();
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userResult = await User.findOne({ username });
    if (!userResult) return respUserPassNotOK();
    console.log(username, password);
    const isUserAndPasswordOK = await bcrypt.compare(
      password,
      userResult.password
    );
    console.log(isUserAndPasswordOK);
    if (isUserAndPasswordOK) {
      const userInfo = {
        id: userResult._id,
        username,
        fullName: userResult.fullName,
        typeUser: userResult.typeUser,
      };
      const token = jwt.sign(userInfo, JWT_SECRET);
      return serverResponse(res, 200, {
        auth: true,
        token,
        userInfo,
        err: undefined,
      });
    } else {
      return respUserPassNotOK();
    }
  } catch (e) {
    return serverResponse(res, 401, {
      auth: false,
      err: e,
    });
  }

  function respUserPassNotOK() {
    return serverResponse(res, 401, {
      auth: false,
      err: "username or password incorrect",
    });
  }
});

router.post(
  "/register",
  body(
    "username",
    "username must contain only uppercase, lowercase letters and numbers"
  ).isAlphanumeric("en-US", { ignore: "_" }),
  body("password", "password need 6 chars").isStrongPassword({ minLength: 6 }),
  body("fullName").isAlphanumeric("he", { ignore: " -_" }),
  (req, res) => {
    const errorsValidator = validationResult(req);
    console.log(errorsValidator);

    const { username, password, fullName } = req.body;
    try {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (!err) {
          try {
            const newUser = new User({ username, password: hash, fullName });
            console.log(newUser);
            if (newUser) {
              await newUser.save();
              const userInfo = {
                id: newUser._id,
                username: newUser.username,
                fullName: newUser.fullName,
              };
              const token = jwt.sign(userInfo, JWT_SECRET);
              return serverResponse(res, 200, {
                auth: true,
                token,
                userInfo,
                err: undefined,
              });
            }
          } catch (e) {
            console.log("e:");
            const errors = [];
            console.log(e, e.keyPattern);
            if (e.code === 11000 && e.keyPattern && "username" in e.keyPattern)
              errors.push("Username already exists");

            if (e.errors) {
              const fields = Object.keys(e.errors);
              for (const field of fields) {
                errors.push(`${field} is ${e.errors[field].kind}`);
              }
            }
            return serverResponse(res, 500, {
              auth: false,
              err: errors,
            });
          }
        }
      });
    } catch (error) {
      console.log(error);
      return serverResponse(res, 500, { auth: false, err: "register failed" });
    }
  }
);

router.post("/checkUser", (req, res) => {
  const token = req.headers["x-access-token"];
  console.log(token);
  try {
    const data = jwt.verify(token, JWT_SECRET);
    serverResponse(res, 200, data);
  } catch (e) {
    serverResponse(res, 500, { auth: false, err: e });
  }
});

module.exports = router;
