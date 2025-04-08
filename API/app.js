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
const authRouter = require("./routes/auth");
const cartRouter = require("./routes/cart");

// Sử dụng các route
app.use("/", homeRoutes);
app.use("/categories", categoriesRouter);
app.use("/products", productsRouter);
app.use("/", authRouter);
app.use("/cart", cartRouter);

// Import các route admin
const adminHomeRouter = require("./routes/admin/adminHome");
const adminCategoriesRouter = require("./routes/admin/adminCategories");
const adminProductsRouter = require("./routes/admin/adminProducts");

// Sử dụng các route admin
app.use("/admin", adminHomeRouter);
app.use("/admin/categories", adminCategoriesRouter);
app.use("/admin/products", adminProductsRouter);
module.exports = app;
