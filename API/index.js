const express = require("express");
const app = require("./app"); // Import ứng dụng từ app.js
const { conn } = require("./config/connect"); // Import kết nối cơ sở dữ liệu

// Chờ kết nối cơ sở dữ liệu trước khi mở cổng server
conn
  .then(() => {
    app.listen(3000, function () {
      console.log("Ứng dụng đang chạy tại địa chỉ: http://localhost:3000");

      // Các đường link truy cập products
      console.log("-------------------------------------");
      console.log("Các đường dẫn API:");
      console.log("GET tất cả sản phẩm: http://localhost:3000/products");
      console.log("GET sản phẩm theo ID: http://localhost:3000/products/:id");
      console.log("POST thêm sản phẩm mới: http://localhost:3000/products");
      console.log("PUT cập nhật sản phẩm: http://localhost:3000/products/:id");
      console.log("DELETE xóa sản phẩm: http://localhost:3000/products/:id");

      // Các đường link truy cập categories
      console.log("-------------------------------------");
      console.log("GET tất cả danh mục: http://localhost:3000/categories");
      console.log("GET danh mục theo ID: http://localhost:3000/categories/:id");
      console.log("POST thêm danh mục mới: http://localhost:3000/categories");
      console.log(
        "PUT cập nhật danh mục: http://localhost:3000/categories/:id"
      );
      console.log("DELETE xóa danh mục: http://localhost:3000/categories/:id");
    });
  })
  .catch((err) => {
    console.error(
      "Không thể khởi động server do lỗi kết nối cơ sở dữ liệu:",
      err
    );
  });
