const { default: mongoose } = require("mongoose");
const {
  Product,
  Category,
  UserProduct,
} = require("../models/modelsBeforeSplit");
const serverResponse = require("../utils/serverResponse");

const getProduct = async (req, res) => {
  const { productId } = req.params;
  let products, product, userProduct;
  if (!mongoose.isValidObjectId(productId)) {
    return serverResponse(res, 501, { error: "Invalid id" });
  }
  
  try {
    product = await Product.findOne({ _id: productId });
    userProduct = await UserProduct.findOne({
      product: productId,
      user: req.userInfo.id,
    });
    console.log(product, userProduct);
    return serverResponse(res, 200, { product, userProduct });
  } catch (error) {
    console.log(error);
    return serverResponse(res, 501, error);
  }
};

/******** !!!לאבטח!!! *******/
const createProduct = async (req, res) => {
  console.log(req.body);
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(newProduct);
    return serverResponse(res, 200, newProduct);
  } catch (error) {
    return serverResponse(res, 501, { error });
  }
};

/******** !!!לאבטח!!! *******/
const editProduct = async (req, res) => {
  if (req.userInfo.typeUser !== "admin") {
    return serverResponse(res, 401, { message: "You are not admin!" });
  }

  const { productId } = req.params;
  const reqUpdates = req.body;

  if (!mongoose.isValidObjectId(productId)) {
    return serverResponse(res, 501, { error: "Invalid id" });
  }

  const allowUpdates = [
    "name",
    "typeUnit",
    "color",
    "imageUrl",
    "parentCategory",
  ];
  const updates = {};

  allowUpdates.forEach((key) => {
    updates[key] = req.body[key];
    delete req.body[key];
  });
  const disallowUpdate = Object.keys(req.body);

  if (disallowUpdate.length > 0) {
    return serverResponse(res, 401, {
      error: "disallow change keys:" + disallowUpdate.join(", "),
    });
  }

  if (mongoose.isValidObjectId(updates.parentCategory)) {
    const parent = await Category.findOne({ _id: updates.parentCategory });
    // parent.parentCategory = parent.parentCategory || []
    console.log(parent.parentCategory);
    updates.parentCategory = [...parent.parentCategory, updates.parentCategory];
  } else if (updates.parentCategory !== undefined) {
    return serverResponse(res, 501, { error: "Invalid parent Id" });
  }

  const updatedProduct = await Product.findOneAndUpdate(
    { _id: productId },
    updates,
    { returnOriginal: false }
  );

  return serverResponse(res, 200, { updatedProduct });
};

const deleteProduct = async (req, res) => {
  if (req.userInfo.typeUser !== "admin") {
    return serverResponse(res, 401, { message: "You are not admin!" });
  }

  const { productId } = req.params;
  if (!mongoose.isValidObjectId(productId)) {
    return serverResponse(res, 501, { error: "Invalid id" });
  }
  const productDeleted = await Product.findOneAndDelete({ _id: productId });
  console.log(productDeleted);
  return serverResponse(res, 200, {
    message: `${productId} deleted`,
    productDeleted,
  });
};

module.exports = {
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
};
