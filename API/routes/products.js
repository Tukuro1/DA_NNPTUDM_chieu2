const express = require("express");
const router = express.Router();
const { conn, sql } = require("../config/connect"); // Đảm bảo bạn có tệp connect.js để kết nối DB

// Định nghĩa route GET /products
router.get("/", async (req, res) => {
  try {
    const pool = await conn; // Kết nối tới cơ sở dữ liệu
    const result = await pool.request().query("SELECT * FROM Products"); // Truy vấn bảng Products
    res.json(result.recordset); // Trả về danh sách sản phẩm
  } catch (err) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", err);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router; // Xuất router
