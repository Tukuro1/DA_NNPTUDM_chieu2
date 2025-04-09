const express = require("express");
const router = express.Router();
const { conn, sql } = require("../config/connect");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Lấy danh sách hóa đơn của người dùng
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.UserID;

    const pool = await conn;

    // Lấy danh sách hóa đơn của người dùng
    const invoices = await pool
      .request()
      .input("UserID", sql.Int, userId)
      .query(
        `SELECT InvoiceID, TotalAmount, CreatedAt 
         FROM Invoices 
         WHERE UserID = @UserID 
         ORDER BY CreatedAt DESC`
      );

    if (invoices.recordset.length === 0) {
      return res.status(404).send("Không tìm thấy hóa đơn nào.");
    }

    res.status(200).json(invoices.recordset);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách hóa đơn:", err);
    res.status(500).send("Lỗi server");
  }
});

// Lấy chi tiết hóa đơn
router.get("/:invoiceId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.UserID;
    const invoiceId = req.params.invoiceId;

    const pool = await conn;

    // Kiểm tra hóa đơn có thuộc về người dùng không
    const invoice = await pool
      .request()
      .input("InvoiceID", sql.Int, invoiceId)
      .input("UserID", sql.Int, userId)
      .query(
        `SELECT InvoiceID, TotalAmount, CreatedAt 
         FROM Invoices 
         WHERE InvoiceID = @InvoiceID AND UserID = @UserID`
      );

    if (invoice.recordset.length === 0) {
      return res.status(404).send("Không tìm thấy hóa đơn.");
    }

    // Lấy danh sách sản phẩm trong hóa đơn
    const invoiceItems = await pool
      .request()
      .input("InvoiceID", sql.Int, invoiceId)
      .query(
        `SELECT ProductID, Quantity, UnitPrice 
         FROM InvoiceItems 
         WHERE InvoiceID = @InvoiceID`
      );

    res.status(200).json({
      invoice: invoice.recordset[0],
      items: invoiceItems.recordset,
    });
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết hóa đơn:", err);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router;
