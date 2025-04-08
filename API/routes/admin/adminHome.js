const express = require("express");
const router = express.Router();
const { conn, sql } = require("../../config/connect");

// Route trang chủ hiển thị danh sách sản phẩm
router.get("/", async (req, res) => {
  try {
    const pool = await conn;
    const result = await pool.request().query("SELECT * FROM Products");
    const products = result.recordset;

    let html = `
      <h1>Chào mừng đến với cửa hàng quần áo</h1>
      <div style="display: flex; flex-wrap: wrap;">`;

    products.forEach((product) => {
      html += `
        <div style="border: 1px solid #ccc; margin: 10px; padding: 10px; width: 200px;">
          <img src="${product.ImageURL}" alt="${product.Name}" style="width: 100%; height: auto;">
          <h3>${product.Name}</h3>
          <p>${product.Description}</p>
          <p>Giá: ${product.Price} VND</p>
          <button>Mua ngay</button>
        </div>`;
    });

    html += `</div>`;
    res.send(html);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", err);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router;
