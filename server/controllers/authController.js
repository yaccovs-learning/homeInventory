const express = require("express");
const jwt = require("jsonwebtoken");
const serverResponse = require("../utils/serverResponse");
const SECRET = "289fnvdc v48uw3 hevsp gjshiof";

const router = express.Router();
router.post("/login", (req, res) => {
  const { user, password } = req.body;
  const token = jwt.sign({ user }, SECRET);
  serverResponse(res, 200, token);
});

router.post("/", (req, res) => {
    const { token } = req.body;
    const data = jwt.verify(token,SECRET);
  serverResponse(res, 200, data);
});

module.exports = router;
