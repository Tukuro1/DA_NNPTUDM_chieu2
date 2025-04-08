const express = require("express");
const { conn, sql } = require("../../config/connect");
const { authenticateToken } = require("../../middlewares/authMiddleware");

const router = express.Router();

// Lấy danh sách tất cả người dùng (chỉ dành cho admin)
router.get("/", authenticateToken, async (req, res) => {
  // Chỉ cho phép admin truy cập
  if (!req.user.Roles.includes("Admin")) {
    return res.status(403).send("Bạn không có quyền truy cập");
  }
  try {
    const pool = await conn;
    // Lấy danh sách tất cả người dùng
    const users = await pool
      .request()
      .query(
        "SELECT UserID, Username, Email, FullName, Phone, Address, CreatedAt FROM Users"
      );
    res.json(users.recordset);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách người dùng:", err);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router;
