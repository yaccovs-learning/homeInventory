const { default: mongoose } = require("mongoose");
const { Category, Product } = require("../models/modelsBeforeSplit");
const serverResponse = require("../utils/serverResponse");

const getCategories = async (req, res) => {
  const { parentCategory } = req.params;
  let categories, category, products;

  try {
    if (mongoose.isValidObjectId(parentCategory)) {
      categories = await Category.find({ parentCategory });
      products = await Product.find({
        parentCategory,
        $or: [{ createdBy: req.userInfo.id }, { isPublic: true }],
      });
      category = await Category.findOne({ _id: parentCategory });
    } else {
      categories = await Category.find({ parentCategory: { $size: 0 } });
      products = await Product.find({
        $or: [{ createdBy: req.userInfo.id }, { isPublic: true }],
      });
    }
    return serverResponse(res, 200, { categories, products, category });
  } catch (error) {
    return serverResponse(res, 501, error);
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    return serverResponse(res, 200, { categories });
  } catch (error) {
    return serverResponse(res, 501, error);
  }
};
/******** !!!לאבטח!!! *******/
const createCategory = async (req, res) => {
  if (req.userInfo.typeUser !== "admin") {
    return serverResponse(res, 401, { message: "You are not admin!" });
  }

  console.log(req.body);
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    console.log(newCategory);
    return serverResponse(res, 200, newCategory);
  } catch (error) {
    return serverResponse(res, 501, { error });
  }
};

/******** !!!לאבטח!!! *******/
const editCategory = async (req, res) => {
  if (req.userInfo.typeUser !== "admin") {
    return serverResponse(res, 401, { message: "You are not admin!" });
  }

  const { categoryId } = req.params;
  if (!mongoose.isValidObjectId(productId)) {
    return serverResponse(res, 501, { error: "Invalid id" });
  }

  const allowUpdates = ["name", "color", "imageUrl", "parentCategory"];
  const reqUpdates = req.body;
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
    const parent = Category.findOne({ _id: updates.parentCategory });
    updates.parentCategory = [...parent.parentCategory, updates.parentCategory];
  } else if (updates.parentCategory !== undefined) {
    return serverResponse(res, 501, { error: "Invalid parent Id" });
  }

  const updatedCategory = await Category.findOneAndUpdate(
    { _id: categoryId },
    updates,
    { returnOriginal: false }
  );

  return serverResponse(res, 200, { updatedCategory });
};

const deleteCategory = async (req, res) => {
  if (req.userInfo.typeUser !== "admin") {
    return serverResponse(res, 401, { message: "You are not admin!" });
  }

  const { categoryId } = req.params;
  if (!mongoose.isValidObjectId(categoryId)) {
    return serverResponse(res, 501, { error: "Invalid id" });
  }
  const categoryDeleted = await Category.findOneAndDelete({ _id: categoryId });
  console.log(categoryDeleted);
  return serverResponse(res, 200, {
    message: `${categoryId} deleted`,
    categoryDeleted,
  });
};

module.exports = {
  getCategories,
  getAllCategories,
  createCategory,
  editCategory,
  deleteCategory,
  
};
