const mongoose = require("mongoose");
const { User } = require("../models/modelsBeforeSplit");
const serverResponse = require("../utils/serverResponse");

const getUserName = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(productId)) {
    return serverResponse(res, 501, { error: "Invalid id" });
  }

  try {
    const userData = await User.findById(userId);
    return serverResponse(res, 200, {
      status: "OK",
      data: { id: userId, username: userData.username },
    });
  } catch (error) {
    return serverResponse(res, 501, { status: "failed", error });
  }
};

module.exports = {
  getUserName,
};
