var express = require("express");
var app = express(); // Sử dụng express trực tiếp nếu không có app.js
var bodyParser = require("body-parser");

// Sử dụng body-parser để parse JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Định nghĩa các route sau middleware body-parser
const productRoutes = require("./routes/products");
app.use("/products", productRoutes);

// Mở cổng server
app.listen(3000, function () {
  console.log("Ứng dụng đang chạy tại địa chỉ: http://localhost:3000");

  // Các đường link truy cập:
  console.log("GET tất cả sản phẩm: http://localhost:3000/products");
  console.log("GET sản phẩm theo ID: http://localhost:3000/products/:id");
  console.log("POST thêm sản phẩm mới: http://localhost:3000/products");
  console.log("PUT cập nhật sản phẩm: http://localhost:3000/products/:id");
  console.log("DELETE xóa sản phẩm: http://localhost:3000/products/:id");
});
