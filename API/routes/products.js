const express = require("express");
const router = express.Router();
const { conn, sql } = require("../config/connect");

// Lấy danh sách sản phẩm
router.get("/", async (req, res) => {
  try {
    const pool = await conn;
    const result = await pool.request().query("SELECT * FROM Products");
    res.json(result.recordset);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", err);
    res.status(500).send("Lỗi server");
  }
});

// Thêm sản phẩm mới
router.post("/", async (req, res) => {
  try {
    const {
      Name,
      Description,
      Price,
      Stock,
      ImageURL,
      Size,
      Color,
      CategoryID,
    } = req.body;

    if (!Name || !Price || !Stock || !CategoryID) {
      return res.status(400).send("Thiếu thông tin sản phẩm");
    }

    const pool = await conn;
    await pool
      .request()
      .input("Name", sql.NVarChar, Name)
      .input("Description", sql.NVarChar, Description)
      .input("Price", sql.Decimal(10, 2), Price)
      .input("Stock", sql.Int, Stock)
      .input("ImageURL", sql.NVarChar, ImageURL)
      .input("Size", sql.NVarChar, Size)
      .input("Color", sql.NVarChar, Color)
      .input("CategoryID", sql.Int, CategoryID)
      .query(
        `INSERT INTO Products (Name, Description, Price, Stock, ImageURL, Size, Color, CategoryID)
         VALUES (@Name, @Description, @Price, @Stock, @ImageURL, @Size, @Color, @CategoryID)`
      );

    res.status(201).send("Sản phẩm đã được thêm thành công");
  } catch (err) {
    console.error("Lỗi khi thêm sản phẩm:", err);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router;
