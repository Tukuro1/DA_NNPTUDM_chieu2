const express = require("express");
const router = express.Router();
const { conn, sql } = require("../config/connect");

// Lấy danh sách danh mục
router.get("/", async (req, res) => {
  try {
    const pool = await conn;
    const result = await pool.request().query("SELECT * FROM Categories");
    res.json(result.recordset);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách danh mục:", err);
    res.status(500).send("Lỗi server");
  }
});

// Thêm danh mục mới
router.post("/", async (req, res) => {
  try {
    const { Name, Description } = req.body;

    if (!Name) {
      return res.status(400).send("Thiếu thông tin danh mục");
    }

    const pool = await conn;
    await pool
      .request()
      .input("Name", sql.NVarChar, Name)
      .input("Description", sql.NVarChar, Description)
      .query(
        `INSERT INTO Categories (Name, Description)
         VALUES (@Name, @Description)`
      );

    res.status(201).send("Danh mục đã được thêm thành công");
  } catch (err) {
    console.error("Lỗi khi thêm danh mục:", err);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router;
