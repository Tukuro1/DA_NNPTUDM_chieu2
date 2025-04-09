const express = require("express");
const router = express.Router();
const { conn, sql } = require("../config/connect");

// Lấy danh sách voucher
router.get("/", async (req, res) => {
  try {
    const pool = await conn;
    const result = await pool
      .request()
      .query("SELECT * FROM Vouchers WHERE IsActive = 1");
    res.json(result.recordset);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách voucher:", err);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router;
