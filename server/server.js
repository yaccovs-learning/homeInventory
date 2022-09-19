require("dotenv").config('./.env');

const express = require("express");
const cors = require("cors");
const EchoStillUnImplementedController = require("./controllers/EchoStillUnImplementedController");
const { response } = require("express");

const app = express();

app.use(cors());
app.use(express.json());

const authController = require("./controllers/authController");
const { default: mongoose } = require("mongoose");

app.use("/api/auth", authController);

app.post("api/users/login", EchoStillUnImplementedController);
app.post("api/users/create", EchoStillUnImplementedController);
app.put("api/users/edit/:userId", EchoStillUnImplementedController);

app.post("api/categories/create", EchoStillUnImplementedController);
app.put("api/categories/edit/:category", EchoStillUnImplementedController);
app.delete("api/categories/delete/:category", EchoStillUnImplementedController);

app.post("api/products/create", EchoStillUnImplementedController);
app.put("api/products/edit/:productId", EchoStillUnImplementedController);
app.delete("api/products/delete/:productId", EchoStillUnImplementedController);

app.put(
  "api/products/:productId/change-amount",
  EchoStillUnImplementedController
);
app.put(
  "api/products/:productId/reset-amount",
  EchoStillUnImplementedController
);
app.put(
  "api/products/:productId/conf-min-max",
  EchoStillUnImplementedController
);
process.env.DEV_DB_URL="mongodb://127.0.0.1:27017/homeInv"
app.get("*", (req, res) => res.status(404).json(404).end());
console.log(process.env.DEV_DB_URL);
mongoose.connect(process.env.DEV_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const port = 7000;
app.listen(port, () => console.log("listen on port " + port));
