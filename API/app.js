const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

// Sử dụng body-parser để parse JSON và form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình thư mục tĩnh cho CSS, JS, hình ảnh
app.use(express.static(path.join(__dirname, "public")));

// Import các route
const homeRoutes = require("./routes/home");
const categoriesRouter = require("./routes/categories");
const productsRouter = require("./routes/products");
const usersRouter = require("./routes/users");
const rolesRouter = require("./routes/roles");

// Sử dụng các route
app.use("/", homeRoutes);
app.use("/categories", categoriesRouter);
app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/roles", rolesRouter);

module.exports = app;
