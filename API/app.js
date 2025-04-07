const express = require("express");
const app = express(); // Khởi tạo ứng dụng Express
var bodyParser = require("body-parser");

const homeRoutes = require("./routes/home");
app.use("/", homeRoutes);

const categoriesRouter = require("./routes/categories");
app.use("/categories", categoriesRouter);

const productsRouter = require("./routes/products");
app.use("/products", productsRouter);

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

const rolesRouter = require("./routes/roles");
app.use("/roles", rolesRouter);
// Sử dụng body-parser để parse JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = app; // Xuất ứng dụng để sử dụng trong index.js
