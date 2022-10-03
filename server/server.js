// node modules imports
require("dotenv").config("./.env");
const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
//

//middlewares
const verifyUser = require("./middleware/verifyUser");
//

// controllers
const EchoStillUnImplementedController = require("./controllers/EchoStillUnImplementedController");
const authController = require("./controllers/authController");
const {
  getCategories,
  createCategory,
  editCategory,
  deleteCategory,
  getAllCategories,
} = require("./controllers/categories");
const {
  createProduct,
  editProduct,
  deleteProduct,
  getProduct,
} = require("./controllers/products");
const {
  changeAmount,
  setMinMaxAmount,
  addProductToUser,
  getUserProducts,
  getUserProduct,
} = require("./controllers/productsUsers");
const { getUserName } = require("./controllers/users");
//

//express - middlewares
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authController);
//

//express routes
//// user routes
app.post("/api/users/login", EchoStillUnImplementedController);
app.post("/api/users/create", EchoStillUnImplementedController);
app.put("/api/users/edit/:userId", EchoStillUnImplementedController);
app.get("/api/users/:userId", verifyUser, getUserName);
////categories routes
app.post("/api/categories/create", verifyUser, createCategory);
app.put("/api/categories/edit/:categoryId", verifyUser, editCategory);
app.delete("/api/categories/delete/:categoryId", verifyUser, deleteCategory);
app.get("/api/categories/all", verifyUser, getAllCategories);
app.get("/api/categories/:parentCategory?", verifyUser, getCategories);
////product admin routes
app.post("/api/products/create", verifyUser, createProduct);
app.put("/api/products/edit/:productId", verifyUser, editProduct);
app.delete("/api/products/delete/:productId", verifyUser, deleteProduct);
//// products routes
app.get("/api/products/me", verifyUser, getUserProducts);
app.get("/api/products/:productId", verifyUser, getProduct);
app.post("/api/products/add/:productId", verifyUser, addProductToUser);
app.put("/api/products/change-amount/:productId", verifyUser, changeAmount);
app.put("/api/products/set-min-max/:productId", verifyUser, setMinMaxAmount);

process.env.DEV_DB_URL = "mongodb://127.0.0.1:27017/homeInv";
app.get("*", (req, res) => res.status(404).json(404).end());
console.log(process.env.DEV_DB_URL);
mongoose.connect(process.env.DEV_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const port = 7000;
app.listen(port, () => console.log("listen on port " + port));
