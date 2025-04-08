const express = require("express");
const router = express.Router();
const { conn, sql } = require("../../config/connect");
const { authenticateToken } = require("../../middlewares/authMiddleware");

// Lấy danh sách sản phẩm
router.get("/", authenticateToken, async (req, res) => {
  // Chỉ cho phép admin truy cập
  if (!req.user.Roles.includes("Admin")) {
    return res.status(403).send("Bạn không có quyền truy cập");
  }
  try {
    const pool = await conn;
    const result = await pool.request().query("SELECT * FROM Products");
    res.json(result.recordset);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", err);
    res.status(500).send("Lỗi server");
  }
});

// Lấy thông tin sản phẩm theo ID
router.get("/:id", authenticateToken, async (req, res) => {
  // Chỉ cho phép admin truy cập
  if (!req.user.Roles.includes("Admin")) {
    return res.status(403).send("Bạn không có quyền truy cập");
  }
  try {
    const { id } = req.params;
    const pool = await conn;
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM Products WHERE ProductID = @ID");

    if (result.recordset.length === 0) {
      return res.status(404).send("Không tìm thấy sản phẩm");
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin sản phẩm:", err);
    res.status(500).send("Lỗi server");
  }
});

// Thêm sản phẩm mới
router.post("/", authenticateToken, async (req, res) => {
  // Chỉ cho phép admin truy cập
  if (!req.user.Roles.includes("Admin")) {
    return res.status(403).send("Bạn không có quyền truy cập");
  }
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

// Cập nhật sản phẩm
router.put("/:id", authenticateToken, async (req, res) => {
  // Chỉ cho phép admin truy cập
  if (!req.user.Roles.includes("Admin")) {
    return res.status(403).send("Bạn không có quyền truy cập");
  }
  try {
    const { id } = req.params;
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
      .input("ID", sql.Int, id)
      .input("Name", sql.NVarChar, Name)
      .input("Description", sql.NVarChar, Description)
      .input("Price", sql.Decimal(10, 2), Price)
      .input("Stock", sql.Int, Stock)
      .input("ImageURL", sql.NVarChar, ImageURL)
      .input("Size", sql.NVarChar, Size)
      .input("Color", sql.NVarChar, Color)
      .input("CategoryID", sql.Int, CategoryID)
      .query(
        `UPDATE Products
           SET Name = @Name, Description = @Description, Price = @Price, Stock = @Stock,
               ImageURL = @ImageURL, Size = @Size, Color = @Color, CategoryID = @CategoryID
           WHERE ID = @ID`
      );

    res.send("Sản phẩm đã được cập nhật thành công");
  } catch (err) {
    console.error("Lỗi khi cập nhật sản phẩm:", err);
    res.status(500).send("Lỗi server");
  }
});

// Xóa sản phẩm
router.delete("/:id", authenticateToken, async (req, res) => {
  // Chỉ cho phép admin truy cập
  if (!req.user.Roles.includes("Admin")) {
    return res.status(403).send("Bạn không có quyền truy cập");
  }
  try {
    const { id } = req.params;

    const pool = await conn;
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM Products WHERE ProductID = @ID");

    res.send("Sản phẩm đã được xóa thành công");
  } catch (err) {
    console.error("Lỗi khi xóa sản phẩm:", err);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router;
