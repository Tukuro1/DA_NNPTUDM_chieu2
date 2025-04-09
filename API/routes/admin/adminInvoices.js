const express = require("express");
const router = express.Router();
const { conn, sql } = require("../../config/connect");
const { authenticateToken } = require("../../middlewares/authMiddleware");

// Lấy danh sách tất cả hóa đơn (READ)
router.get("/", authenticateToken, async (req, res) => {
  // Chỉ cho phép admin truy cập
  if (!req.user.Roles.includes("Admin")) {
    return res.status(403).send("Bạn không có quyền truy cập");
  }
  try {
    const pool = await conn;

    const invoices = await pool.request().query(
      `SELECT i.InvoiceID, i.TotalAmount, i.CreatedAt, u.UserID, u.Username 
       FROM Invoices i
       INNER JOIN Users u ON i.UserID = u.UserID
       ORDER BY i.CreatedAt DESC`
    );

    if (invoices.recordset.length === 0) {
      return res.status(404).send("Không có hóa đơn nào.");
    }

    res.status(200).json(invoices.recordset);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách hóa đơn:", err);
    res.status(500).send("Lỗi server");
  }
});

// Lấy chi tiết hóa đơn (READ)
router.get("/:invoiceId", authenticateToken, async (req, res) => {
  if (!req.user.Roles.includes("Admin")) {
    return res.status(403).send("Bạn không có quyền truy cập");
  }
  try {
    const invoiceId = req.params.invoiceId;
    const pool = await conn;

    const invoice = await pool
      .request()
      .input("InvoiceID", sql.Int, invoiceId)
      .query(
        `SELECT i.InvoiceID, i.TotalAmount, i.CreatedAt, u.UserID, u.Username 
         FROM Invoices i
         INNER JOIN Users u ON i.UserID = u.UserID
         WHERE i.InvoiceID = @InvoiceID`
      );

    if (invoice.recordset.length === 0) {
      return res.status(404).send("Không tìm thấy hóa đơn.");
    }

    const invoiceItems = await pool
      .request()
      .input("InvoiceID", sql.Int, invoiceId)
      .query(
        `SELECT ii.ProductID, p.Name AS ProductName, ii.Quantity, ii.UnitPrice 
         FROM InvoiceItems ii
         INNER JOIN Products p ON ii.ProductID = p.ProductID
         WHERE ii.InvoiceID = @InvoiceID`
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

// Tạo hóa đơn mới (CREATE)
router.post("/", authenticateToken, async (req, res) => {
  if (!req.user.Roles.includes("Admin")) {
    return res.status(403).send("Bạn không có quyền truy cập");
  }
  try {
    const { UserID, TotalAmount, items } = req.body; // items là danh sách sản phẩm
    const pool = await conn;

    const result = await pool
      .request()
      .input("UserID", sql.Int, UserID)
      .input("TotalAmount", sql.Decimal(10, 2), TotalAmount)
      .query(
        `INSERT INTO Invoices (UserID, TotalAmount, CreatedAt) 
         OUTPUT INSERTED.InvoiceID 
         VALUES (@UserID, @TotalAmount, GETDATE())`
      );

    const invoiceId = result.recordset[0].InvoiceID;

    for (const item of items) {
      await pool
        .request()
        .input("InvoiceID", sql.Int, invoiceId)
        .input("ProductID", sql.Int, item.ProductID)
        .input("Quantity", sql.Int, item.Quantity)
        .input("UnitPrice", sql.Decimal(10, 2), item.UnitPrice)
        .query(
          `INSERT INTO InvoiceItems (InvoiceID, ProductID, Quantity, UnitPrice) 
           VALUES (@InvoiceID, @ProductID, @Quantity, @UnitPrice)`
        );
    }

    res.status(201).send(`Hóa đơn mới đã được tạo với ID: ${invoiceId}`);
  } catch (err) {
    console.error("Lỗi khi tạo hóa đơn:", err);
    res.status(500).send("Lỗi server");
  }
});

// Cập nhật hóa đơn (UPDATE)
router.put("/:invoiceId", authenticateToken, async (req, res) => {
  if (!req.user.Roles.includes("Admin")) {
    return res.status(403).send("Bạn không có quyền truy cập");
  }
  try {
    const invoiceId = req.params.invoiceId;
    const { items } = req.body; // items là danh sách sản phẩm cần cập nhật
    const pool = await conn;

    // Kiểm tra xem hóa đơn có tồn tại không
    const invoice = await pool
      .request()
      .input("InvoiceID", sql.Int, invoiceId)
      .query(`SELECT * FROM Invoices WHERE InvoiceID = @InvoiceID`);

    if (invoice.recordset.length === 0) {
      return res.status(404).send("Không tìm thấy hóa đơn.");
    }

    // Xóa các sản phẩm cũ trong hóa đơn
    await pool
      .request()
      .input("InvoiceID", sql.Int, invoiceId)
      .query(`DELETE FROM InvoiceItems WHERE InvoiceID = @InvoiceID`);

    // Thêm các sản phẩm mới và tính lại tổng tiền
    let totalAmount = 0;
    for (const item of items) {
      const { ProductID, Quantity, UnitPrice } = item;

      // Tính tổng tiền cho sản phẩm này
      const itemTotal = Quantity * UnitPrice;
      totalAmount += itemTotal;

      // Thêm sản phẩm mới vào hóa đơn
      await pool
        .request()
        .input("InvoiceID", sql.Int, invoiceId)
        .input("ProductID", sql.Int, ProductID)
        .input("Quantity", sql.Int, Quantity)
        .input("UnitPrice", sql.Decimal(10, 2), UnitPrice)
        .query(
          `INSERT INTO InvoiceItems (InvoiceID, ProductID, Quantity, UnitPrice) 
           VALUES (@InvoiceID, @ProductID, @Quantity, @UnitPrice)`
        );
    }

    // Cập nhật tổng tiền trong bảng Invoices
    await pool
      .request()
      .input("InvoiceID", sql.Int, invoiceId)
      .input("TotalAmount", sql.Decimal(10, 2), totalAmount)
      .query(
        `UPDATE Invoices 
         SET TotalAmount = @TotalAmount 
         WHERE InvoiceID = @InvoiceID`
      );

    res
      .status(200)
      .send(
        `Hóa đơn với ID: ${invoiceId} đã được cập nhật. Tổng tiền mới: ${totalAmount}`
      );
  } catch (err) {
    console.error("Lỗi khi cập nhật hóa đơn:", err);
    res.status(500).send("Lỗi server");
  }
});

// Xóa hóa đơn (DELETE)
router.delete("/:invoiceId", authenticateToken, async (req, res) => {
  if (!req.user.Roles.includes("Admin")) {
    return res.status(403).send("Bạn không có quyền truy cập");
  }
  try {
    const invoiceId = req.params.invoiceId;
    const pool = await conn;

    // Xóa các sản phẩm trong hóa đơn
    await pool
      .request()
      .input("InvoiceID", sql.Int, invoiceId)
      .query(`DELETE FROM InvoiceItems WHERE InvoiceID = @InvoiceID`);

    // Xóa hóa đơn
    await pool
      .request()
      .input("InvoiceID", sql.Int, invoiceId)
      .query(`DELETE FROM Invoices WHERE InvoiceID = @InvoiceID`);

    res.status(200).send(`Hóa đơn với ID: ${invoiceId} đã được xóa`);
  } catch (err) {
    console.error("Lỗi khi xóa hóa đơn:", err);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router;
