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
    await product.populate({
      path: "owner",
      model: "User",
      select: "username",
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
  if (Array.isArray(req.body.parentCategory))
    req.body.parentCategory =
      req.body.parentCategory[req.body.parentCategory.length - 1];

  req.body.isPublic = !!req.body.isPublic;

  const allowProp = [
    "name",
    "description",
    "unitType",
    "color",
    "imageUrl",
    "parentCategory",
    "owner",
    "isPublic",
  ];
  const updates = {};

  allowProp.forEach((key) => {
    updates[key] = req.body[key];
    delete req.body[key];
  });
  const disallowUpdate = Object.keys(req.body);
  console.log({ disallowUpdate, updates });
  // if (disallowUpdate.length > 0) {
  //   return serverResponse(res, 401, {
  //     error: "disallow change keys:" + disallowUpdate.join(", "),
  //   });
  // }
  if (req.userInfo.typeUser !== "admin") {
    updates.owner = req.userInfo.id;
  }

  if (mongoose.isValidObjectId(updates.parentCategory)) {
    const parent = await Category.findOne({ _id: updates.parentCategory });
    // parent.parentCategory = parent.parentCategory || []
    console.log(parent.parentCategory);
    updates.parentCategory = [...parent.parentCategory, updates.parentCategory];
  } else if (!updates.parentCategory) {
    delete updates.parentCategory;
  } else {
    return serverResponse(res, 501, {
      error: "Invalid parentCategory",
      parentCategory: updates.parentCategory,
    });
  }

  const newProduct = new Product(updates);
  await newProduct.save();

  return serverResponse(res, 200, { newProduct });
};

/******** !!!לאבטח!!! *******/
const editProduct = async (req, res) => {
  if (req.userInfo.typeUser !== "admin") {
    return serverResponse(res, 401, { message: "You are not admin!" });
  }

  const { productId } = req.params;
  if (Array.isArray(req.body.parentCategory))
    req.body.parentCategory =
      req.body.parentCategory[req.body.parentCategory.length - 1];
  if (!mongoose.isValidObjectId(productId)) {
    return serverResponse(res, 501, { error: "Invalid id" });
  }

  const allowUpdates = [
    "name",
    "description",
    "unitType",
    "color",
    "imageUrl",
    "parentCategory",
    "owner",
    "isPublic",
  ];
  const updates = {};

  allowUpdates.forEach((key) => {
    updates[key] = req.body[key];
    delete req.body[key];
  });
  const disallowUpdate = Object.keys(req.body);
  console.log({ disallowUpdate, updates });

  // if (disallowUpdate.length > 0) {
  //   return serverResponse(res, 401, {
  //     error: "disallow change keys:" + disallowUpdate.join(", "),
  //   });
  // }

  if (mongoose.isValidObjectId(updates.parentCategory)) {
    const parent = await Category.findOne({ _id: updates.parentCategory });
    // parent.parentCategory = parent.parentCategory || []
    console.log(parent.parentCategory);
    updates.parentCategory = [...parent.parentCategory, updates.parentCategory];
  } else if (updates.parentCategory !== undefined) {
    return serverResponse(res, 501, {
      error: "Invalid parentCategory",
      parentCategory: updates.parentCategory,
    });
  }

  const updatedProduct = await Product.findOneAndUpdate(
    { _id: productId },
    updates,
    { returnOriginal: false }
  );

  return serverResponse(res, 200, { updatedProduct });
};

// מחיקת מוצר
const deleteProduct = async (req, res) => {
  if (req.userInfo.typeUser !== "admin") {
    return serverResponse(res, 401, { message: "You are not admin!" });
  }
  const recursive = false;
  const { productId } = req.params;
  if (!mongoose.isValidObjectId(productId)) {
    return serverResponse(res, 501, { error: "Invalid id" });
  }

  if (recursive) {
    await UserProduct.deleteMany({ product: productId });
  } else {
    const userProductLinks = await UserProduct.find({
      product: productId,
    }).populate({ path: "user", select: "name" });
    console.log(userProductLinks);

    if (userProductLinks.length > 0) {
      return serverResponse(res, 400, {
        error: `${productId} not deleted, There are UserProduct linked`,
      });
    }
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
