const express = require("express");
const app = express(); // Khởi tạo ứng dụng Express

const categoriesRouter = require("./routes/categories");
app.use("/categories", categoriesRouter);

const productsRouter = require("./routes/products");
app.use("/products", productsRouter);

module.exports = app; // Xuất ứng dụng để sử dụng trong index.js
