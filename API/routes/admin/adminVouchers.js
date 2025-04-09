const express = require("express");
const router = express.Router();
const { conn, sql } = require("../../config/connect");
const { authenticateToken } = require("../../middlewares/authMiddleware");

// Lấy danh sách voucher
router.get("/", authenticateToken, async (req, res) => {
  // Chỉ cho phép admin truy cập
  if (!req.user.Roles.includes("Admin")) {
    return res.status(403).send("Bạn không có quyền truy cập");
  }
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

// Thêm voucher mới (Admin)
router.post("/", authenticateToken, async (req, res) => {
  if (!req.user.Roles.includes("Admin")) {
    return res.status(403).send("Bạn không có quyền truy cập");
  }
  try {
    const { Code, DiscountPercentage, ExpiryDate } = req.body;

    if (!Code || !DiscountPercentage || !ExpiryDate) {
      return res.status(400).send("Thiếu thông tin voucher");
    }

    const pool = await conn;
    await pool
      .request()
      .input("Code", sql.NVarChar, Code)
      .input("DiscountPercentage", sql.Decimal(5, 2), DiscountPercentage)
      .input("ExpiryDate", sql.DateTime, ExpiryDate)
      .query(
        `INSERT INTO Vouchers (Code, DiscountPercentage, ExpiryDate)
         VALUES (@Code, @DiscountPercentage, @ExpiryDate)`
      );

    res.status(201).send("Voucher đã được thêm thành công");
  } catch (err) {
    console.error("Lỗi khi thêm voucher:", err);
    res.status(500).send("Lỗi server");
  }
});

// Xóa voucher (Admin)
router.delete("/:id", authenticateToken, async (req, res) => {
  if (!req.user.Roles.includes("Admin")) {
    return res.status(403).send("Bạn không có quyền truy cập");
  }
  try {
    const { id } = req.params;

    const pool = await conn;
    await pool
      .request()
      .input("VoucherID", sql.Int, id)
      .query("UPDATE Vouchers SET IsActive = 0 WHERE VoucherID = @VoucherID");

    res.send("Voucher đã được vô hiệu hóa");
  } catch (err) {
    console.error("Lỗi khi xóa voucher:", err);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router;
