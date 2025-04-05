const express = require("express");
const router = express.Router();
const { conn, sql } = require("../config/connect"); // Đảm bảo bạn có tệp connect.js để kết nối DB

// Định nghĩa route GET /products (Read all products)
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

// Định nghĩa route GET /products/:id (Read a single product by ID)
router.get("/:id", async (req, res) => {
  try {
    const pool = await conn;
    const result = await pool
      .request()
      .input("ProductID", sql.Int, req.params.id)
      .query("SELECT * FROM Products WHERE ProductID = @ProductID");
    if (result.recordset.length === 0) {
      console.log(`Không tìm thấy sản phẩm với ID: ${req.params.id}`);
      return res.status(404).send("Sản phẩm không tồn tại");
    }
    console.log(`Lấy thông tin sản phẩm với ID: ${req.params.id}`);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Lỗi khi lấy sản phẩm:", err);
    res.status(500).send("Lỗi server");
  }
});

// Định nghĩa route POST /products (Create a new product)
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
    } = req.body || {}; // Thêm fallback để tránh lỗi destructure

    // Kiểm tra nếu thiếu dữ liệu
    if (!Name || !Price || !Stock || !CategoryID) {
      console.log("Thiếu thông tin sản phẩm khi thêm mới");
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
    console.log(`Thêm sản phẩm mới: ${Name}`);
    res.status(201).send("Sản phẩm đã được thêm thành công");
  } catch (err) {
    console.error("Lỗi khi thêm sản phẩm:", err);
    res.status(500).send("Lỗi server");
  }
});

// Định nghĩa route PUT /products/:id (Update a product by ID)
router.put("/:id", async (req, res) => {
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
    const pool = await conn;
    const result = await pool
      .request()
      .input("ProductID", sql.Int, req.params.id)
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
         WHERE ProductID = @ProductID`
      );
    if (result.rowsAffected[0] === 0) {
      console.log(
        `Không tìm thấy sản phẩm với ID: ${req.params.id} để cập nhật`
      );
      return res.status(404).send("Sản phẩm không tồn tại");
    }
    console.log(`Cập nhật sản phẩm với ID: ${req.params.id}`);
    res.send("Sản phẩm đã được cập nhật thành công");
  } catch (err) {
    console.error("Lỗi khi cập nhật sản phẩm:", err);
    res.status(500).send("Lỗi server");
  }
});

// Định nghĩa route DELETE /products/:id (Delete a product by ID)
router.delete("/:id", async (req, res) => {
  try {
    const pool = await conn;
    const result = await pool
      .request()
      .input("ProductID", sql.Int, req.params.id)
      .query("DELETE FROM Products WHERE ProductID = @ProductID");
    if (result.rowsAffected[0] === 0) {
      console.log(`Không tìm thấy sản phẩm với ID: ${req.params.id} để xóa`);
      return res.status(404).send("Sản phẩm không tồn tại");
    }
    console.log(`Xóa sản phẩm với ID: ${req.params.id}`);
    res.send("Sản phẩm đã được xóa thành công");
  } catch (err) {
    console.error("Lỗi khi xóa sản phẩm:", err);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router; // Xuất router
