const { default: mongoose } = require("mongoose");
const {
  Product,
  UserProduct,
  Operation,
} = require("../models/modelsBeforeSplit");
const serverResponse = require("../utils/serverResponse");

/************************************/
const getUserProducts = async (req, res) => {
  const products = await UserProduct.find({ user: req.userInfo.id }).populate(
    "product"
  );
  return serverResponse(res, 200, { products });
};

const getUserProduct = async (req, res) => {
  const { productId } = req.params;
  if (!mongoose.isValidObjectId(productId)) {
    return serverResponse(res, 501, { error: "Invalid id" });
  }

  const product = await UserProduct.findOne({
    product: productId,
    user: req.userInfo.id,
  }).populate("product");
  return serverResponse(res, 200, { product });
};

const addProductToUser = async (req, res) => {
  const { productId } = req.params;
  if (!mongoose.isValidObjectId(productId)) {
    return serverResponse(res, 501, { error: "Invalid id" });
  }

  const { unitType, minAmount, maxAmount, currentAmount } = req.body;
  const userProductDetails = {
    user: req.userInfo.id,
    product: productId,
    unitType,
    minAmount,
    maxAmount,
    currentAmount,
  };

  const newProductForUser = new UserProduct(userProductDetails);
  newProductForUser.save();
  return serverResponse(res, 200, { product: newProductForUser });
};

const changeAmount = async (req, res) => {
  const { productId } = req.params;
  if (!mongoose.isValidObjectId(productId)) {
    return serverResponse(res, 501, { error: "Invalid id" });
  }
  const product = await Product.findById(productId);
  if (!product) {
    return serverResponse(res, 501, { error: "not exists id" });
  }

  const amount = Number(req.body.amount);
  const operationDetails = {
    user: req.userInfo.id,
    product: productId,
    timeOperation: new Date(),
    updateOperation: new Date(),
    isInit: req.body.action === "reset",
    amount: amount,
  };

  try {
    let changeProduct;

    const mongooseOptions = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    };

    const query = { product: productId, user: req.userInfo.id };

    if (operationDetails.isInit) {
      changeProduct = await UserProduct.findOneAndUpdate(
        query,
        { currentAmount: amount },
        mongooseOptions
      );
    } else {
      changeProduct = await UserProduct.findOneAndUpdate(
        query,
        { $inc: { currentAmount: amount } },
        mongooseOptions
      );
    }
    console.log(changeProduct);
    if (typeof changeProduct.unitType === "undefined") {
      changeProduct.unitType = product.unitType;
    }
    await changeProduct.save();
    changeProduct.product = product;
    console.log(changeProduct);
    const newOperation = new Operation(operationDetails);
    newOperation.save();
    return serverResponse(res, 200, { status: "OK", data: changeProduct });
  } catch (err) {
    return serverResponse(res, 500, { status: "failed", err });
  }
};

const setMinMaxAmount = async (req, res) => {
  const { productId } = req.params;
  if (!mongoose.isValidObjectId(productId)) {
    return serverResponse(res, 500, { error: "Invalid id" });
  }
  const minAmount = Number(req.body.min);
  const maxAmount = Number(req.body.max);

  const query = {
    product: productId,
    user: req.userInfo.id,
  };

  const update = {
    minAmount,
    maxAmount,
  };
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return serverResponse(res, 501, { error: "not exists product" });
    }

    const userProduct = await UserProduct.findOneAndUpdate(query, update, {
      new: true,
    });

    if (userProduct) {
      await userProduct.save();

      // manual populate
      userProduct.product = product;

      return serverResponse(res, 200, {
        status: "OK",
        new: false,
        data: userProduct,
      });
    } else {
      // create new userProduct

      const newUserProduct = new UserProduct({
        ...query,
        ...update,
        currentAmount: 0,
        unitType: product.unitType,
      });
      await newUserProduct.save();

      // manual populate
      newUserProduct.product = product;

      return serverResponse(res, 200, {
        status: "OK",
        new: true,
        data: newUserProduct,
      });
    }
  } catch (e) {
    console.log(e);
    return serverResponse(res, 501, { status: "failed" });
  }
};

module.exports = {
  changeAmount,
  setMinMaxAmount,
  addProductToUser,
  getUserProducts,
  getUserProduct,
};
