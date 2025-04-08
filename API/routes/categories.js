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

// Lấy thông tin danh mục theo ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await conn;
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM Categories WHERE CategoryID = @ID");

    if (result.recordset.length === 0) {
      return res.status(404).send("Không tìm thấy danh mục");
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin danh mục:", err);
    res.status(500).send("Lỗi server");
  }
});

// // Thêm danh mục mới
// router.post("/", async (req, res) => {
//   try {
//     const { Name, Description } = req.body;

//     if (!Name) {
//       return res.status(400).send("Thiếu thông tin danh mục");
//     }

//     const pool = await conn;
//     await pool
//       .request()
//       .input("Name", sql.NVarChar, Name)
//       .input("Description", sql.NVarChar, Description)
//       .query(
//         `INSERT INTO Categories (Name, Description)
//          VALUES (@Name, @Description)`
//       );

//     res.status(201).send("Danh mục đã được thêm thành công");
//   } catch (err) {
//     console.error("Lỗi khi thêm danh mục:", err);
//     res.status(500).send("Lỗi server");
//   }
// });

// // Cập nhật danh mục
// router.put("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { Name, Description } = req.body;

//     if (!Name) {
//       return res.status(400).send("Thiếu thông tin danh mục");
//     }

//     const pool = await conn;
//     await pool
//       .request()
//       .input("ID", sql.Int, id)
//       .input("Name", sql.NVarChar, Name)
//       .input("Description", sql.NVarChar, Description)
//       .query(
//         `UPDATE Categories
//          SET Name = @Name, Description = @Description
//          WHERE ID = @ID`
//       );

//     res.send("Danh mục đã được cập nhật thành công");
//   } catch (err) {
//     console.error("Lỗi khi cập nhật danh mục:", err);
//     res.status(500).send("Lỗi server");
//   }
// });

// // Xóa danh mục
// router.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const pool = await conn;
//     await pool
//       .request()
//       .input("ID", sql.Int, id)
//       .query("DELETE FROM Categories WHERE CategoryID = @ID");

//     res.send("Danh mục đã được xóa thành công");
//   } catch (err) {
//     console.error("Lỗi khi xóa danh mục:", err);
//     res.status(500).send("Lỗi server");
//   }
// });

module.exports = router;
