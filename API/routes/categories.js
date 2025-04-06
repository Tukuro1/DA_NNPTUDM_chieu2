const express = require("express");
const router = express.Router();
const { conn, sql } = require("../config/connect"); // Import kết nối cơ sở dữ liệu

// Định nghĩa route GET /categories (Read all categories)
router.get("/", async (req, res) => {
  try {
    const pool = await conn; // Kết nối tới cơ sở dữ liệu
    const result = await pool.request().query("SELECT * FROM Categories"); // Truy vấn bảng Categories
    res.json(result.recordset); // Trả về danh sách danh mục
  } catch (err) {
    console.error("Lỗi khi lấy danh sách danh mục:", err);
    res.status(500).send("Lỗi server");
  }
});

// Định nghĩa route GET /categories/:id (Read a single category by ID)
router.get("/:id", async (req, res) => {
  try {
    const pool = await conn;
    const result = await pool
      .request()
      .input("CategoryID", sql.Int, req.params.id)
      .query("SELECT * FROM Categories WHERE CategoryID = @CategoryID");
    if (result.recordset.length === 0) {
      return res.status(404).send("Danh mục không tồn tại");
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Lỗi khi lấy danh mục:", err);
    res.status(500).send("Lỗi server");
  }
});

// Định nghĩa route POST /categories (Create a new category)
router.post("/", async (req, res) => {
  try {
    const { Name, Description } = req.body;

    // Kiểm tra nếu thiếu dữ liệu
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

// Định nghĩa route PUT /categories/:id (Update a category by ID)
router.put("/:id", async (req, res) => {
  try {
    const { Name, Description } = req.body;

    // Kiểm tra nếu thiếu dữ liệu
    if (!Name) {
      return res.status(400).send("Thiếu thông tin danh mục");
    }

    const pool = await conn;
    const result = await pool
      .request()
      .input("CategoryID", sql.Int, req.params.id)
      .input("Name", sql.NVarChar, Name)
      .input("Description", sql.NVarChar, Description)
      .query(
        `UPDATE Categories
         SET Name = @Name, Description = @Description
         WHERE CategoryID = @CategoryID`
      );
    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("Danh mục không tồn tại");
    }
    res.send("Danh mục đã được cập nhật thành công");
  } catch (err) {
    console.error("Lỗi khi cập nhật danh mục:", err);
    res.status(500).send("Lỗi server");
  }
});

// Định nghĩa route DELETE /categories/:id (Delete a category by ID)
router.delete("/:id", async (req, res) => {
  try {
    const pool = await conn;
    const result = await pool
      .request()
      .input("CategoryID", sql.Int, req.params.id)
      .query("DELETE FROM Categories WHERE CategoryID = @CategoryID");
    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("Danh mục không tồn tại");
    }
    res.send("Danh mục đã được xóa thành công");
  } catch (err) {
    console.error("Lỗi khi xóa danh mục:", err);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router; // Xuất router
