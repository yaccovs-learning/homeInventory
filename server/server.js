require("dotenv").config();

const express = require("express");
const cors = require("cors");
const EchoController = require("./controllers/EchoController");
const { response } = require("express");

const app = express();

app.use(cors());
app.use(express.json());

const authController = require("./controllers/authController");

app.use("/api/auth", authController);

app.post("api/users/login", EchoController);
app.post("api/users/create", EchoController);
app.put("api/users/edit/:userId", EchoController);

app.post("api/categories/create", EchoController);
app.put("api/categories/edit/:category", EchoController);
app.delete("api/categories/delete/:category", EchoController);

app.post("api/products/create", EchoController);
app.put("api/products/edit/:productId", EchoController);
app.delete("api/products/delete/:productId", EchoController);

app.put("api/products/:productId/change-amount", EchoController);
app.put("api/products/:productId/reset-amount", EchoController);
app.put("api/products/:productId/conf-min-max", EchoController);

app.get("*", (req, res) => res.status(404).json(404).end());

const port = 7000;
app.listen(port, () => console.log("listen on port " + port));
