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
      console.log("Các đường dẫn API: truy cập products");
      console.log("GET tất cả sản phẩm: http://localhost:3000/products");
      console.log("GET sản phẩm theo ID: http://localhost:3000/products/:id");
      console.log(
        "POST thêm sản phẩm mới: http://localhost:3000/admin/products"
      );
      console.log(
        "PUT cập nhật sản phẩm: http://localhost:3000/admin/products/:id"
      );
      console.log(
        "DELETE xóa sản phẩm: http://localhost:3000/admin/products/:id"
      );

      // Các đường link truy cập login-register
      console.log("-------------------------------------");
      console.log("Các đường dẫn API: login-register");
      console.log("POST đăng nhập: http://localhost:3000/login");
      console.log("POST đăng ký: http://localhost:3000/register");
      console.log(
        "GET lấy thông tin người dùng: http://localhost:3000/profile"
      );
      console.log(
        "PUT cập nhật thông tin người dùng: http://localhost:3000/profile"
      );
      console.log("GET lấy danh sách hóa đơn: http://localhost:3000/invoices");
      console.log(
        "GET lấy chi tiết hóa đơn: http://localhost:3000/invoices/:Id(invoiceId)"
      );
      // Các đường link truy cập giỏ hàng và thanh toán
      console.log("-------------------------------------");
      console.log("Các đường dẫn API: hàng và thanh toán");
      console.log(
        "POST thêm sản phẩm vào giỏ hàng: http://localhost:3000/cart"
      );
      console.log("GET xem giỏ hàng: http://localhost:3000/cart");
      console.log(
        "DELETE xóa sản phẩm trong giỏ hàng: http://localhost:3000/cart/:id(CartItemID)"
      );
      console.log(
        "PUT cập nhật số lượng sản phẩm trong giỏ hàng: http://localhost:3000/cart/:id(CartItemID)"
      );
      console.log("POST thanh toán: http://localhost:3000/cart/checkout");

      // Các đường link truy cập chức năng admin
      console.log("-------------------------------------");
      console.log("Các đường dẫn API: chức năng admin");
      console.log(
        "GET danh sách tất cả người dùng: http://localhost:3000/admin/users"
      );
      console.log(
        "GET danh sách tất cả hóa đơn: http://localhost:3000/admin/invoices"
      );
      console.log(
        "POST lấy chi tiết hóa đơn: http://localhost:3000/admin/invoices/:Id(invoiceId)"
      );
      console.log("GET tạo hóa đơn mới: http://localhost:3000/admin/invoices");
      console.log(
        "PUT cập nhật hóa đơn: http://localhost:3000/admin/invoices/:Id(invoiceId)"
      );
      console.log(
        "DELETE xóa hóa đơn: http://localhost:3000/admin/invoices/:Id(invoiceId)"
      );
      console.log(
        "GET danh sách tất cả voucher: http://localhost:3000/vouchers"
      );
      console.log("GET thêm voucher: http://localhost:3000/admin/vouchers");
      console.log("POST thêm voucher: http://localhost:3000/admin/vouchers");
    });
  })
  .catch((err) => {
    console.error(
      "Không thể khởi động server do lỗi kết nối cơ sở dữ liệu:",
      err
    );
  });
