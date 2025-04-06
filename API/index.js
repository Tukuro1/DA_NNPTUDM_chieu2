const express = require("express");
const app = require("./app"); // Import ứng dụng từ app.js

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
