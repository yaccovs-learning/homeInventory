const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  typeUser: { type: String, enum: ["user", "admin"], default: "user" },
});
const User = mongoose.model("User", UserSchema);

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  color: { type: String },
  imageUrl: { type: String },
  parentCategory: { type: mongoose.Types.ObjectId, ref: "Category" },
});
const Category = mongoose.model("Category", CategorySchema);

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  typeUnit: { type: String, enum: ["kg", "unit"], required: true },
  color: { type: String },
  imageUrl: { type: String },
  parentCategory: { type: mongoose.Types.ObjectId, ref: "Category" },
  createBy: { type: mongoose.Types.ObjectId, ref: "User" },
});
const Product = mongoose.model("Product", ProductSchema);

const UserProductSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  product: { type: mongoose.Types.ObjectId, ref: "Product" },
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  currentAmount: { type: Number, required: true }, // אם אפשר שיהיה מבוסס על הנתונים של הפעולות
});

const UserProduct = mongoose.model("UserProduct", UserProductSchema);

const OperationSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  product: { type: mongoose.Types.ObjectId, ref: "Product" },
  timeOperation: { type: Date, required: true },
  updateOperation: { type: Date, required: true }, //אולי אין צורך
  init: { type: Boolean, required: true },
  amount: { type: Number, default: 0 },
});

const Operation = mongoose.model('Operation',OperationSchema)