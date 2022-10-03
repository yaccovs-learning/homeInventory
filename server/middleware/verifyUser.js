const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const serverResponse = require("../utils/serverResponse");

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const verifyUser =  (req, res, next) => {
  const token = req.headers["x-access-token"];
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.userInfo = data;
    console.log(new Date(), req.method, req.url, req.userInfo.username, req.userInfo.typeUser);

    next();
  } catch (e) {
    console.log(new Date(), req.method, req.url, "Access Denied");
    return serverResponse(res, 401, { auth: false, err: e });
  }
};

module.exports = verifyUser