const express = require("express");
const router = express.Router();
const { conn, sql } = require("../config/connect"); // Đảm bảo bạn có tệp connect.js để kết nối DB

// Định nghĩa route GET /users (Read all users)
router.get("/", async (req, res) => {
  try {
    const pool = await conn; // Kết nối tới cơ sở dữ liệu
    const result = await pool.request().query("SELECT * FROM Users"); // Truy vấn bảng Users
    res.json(result.recordset); // Trả về danh sách người dùng
  } catch (err) {
    console.error("Lỗi khi lấy dữ liệu người dùng:", err);
    res.status(500).send("Lỗi server");
  }
});

// Định nghĩa route GET /users/:id (Read a single user by ID)
router.get("/:id", async (req, res) => {
  try {
    const pool = await conn;
    const result = await pool
      .request()
      .input("UserID", sql.Int, req.params.id)
      .query("SELECT * FROM Users WHERE UserID = @UserID");
    if (result.recordset.length === 0) {
      console.log(`Không tìm thấy người dùng với ID: ${req.params.id}`);
      return res.status(404).send("Người dùng không tồn tại");
    }
    console.log(`Lấy thông tin người dùng với ID: ${req.params.id}`);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Lỗi khi lấy người dùng:", err);
    res.status(500).send("Lỗi server");
  }
});

// Định nghĩa route POST /users (Create a new user)
router.post("/", async (req, res) => {
  try {
    const { UserName, Password, Email, Role } = req.body || {}; // Thêm fallback để tránh lỗi destructure

    // Kiểm tra nếu thiếu dữ liệu
    if (!UserName || !Password || !Email || !Role) {
      console.log("Thiếu thông tin người dùng khi thêm mới");
      return res.status(400).send("Thiếu thông tin người dùng");
    }

    const pool = await conn;
    await pool
      .request()
      .input("UserName", sql.NVarChar, UserName)
      .input("Password", sql.NVarChar, Password)
      .input("Email", sql.NVarChar, Email)
      .input("Role", sql.NVarChar, Role)
      .query(
        `INSERT INTO Users (UserName, Password, Email, Role)
         VALUES (@UserName, @Password, @Email, @Role)`
      );
    console.log(`Thêm người dùng mới: ${UserName}`);
    res.status(201).send("Người dùng đã được thêm thành công");
  } catch (err) {
    console.error("Lỗi khi thêm người dùng:", err);
    res.status(500).send("Lỗi server");
  }
});

// Định nghĩa route PUT /users/:id (Update a user by ID)
router.put("/:id", async (req, res) => {
  try {
    const { UserName, Password, Email, Role } = req.body;
    const pool = await conn;
    const result = await pool
      .request()
      .input("UserID", sql.Int, req.params.id)
      .input("UserName", sql.NVarChar, UserName)
      .input("Password", sql.NVarChar, Password)
      .input("Email", sql.NVarChar, Email)
      .input("Role", sql.NVarChar, Role)
      .query(
        `UPDATE Users
         SET UserName = @UserName, Password = @Password, Email = @Email, Role = @Role
         WHERE UserID = @UserID`
      );
    if (result.rowsAffected[0] === 0) {
      console.log(
        `Không tìm thấy người dùng với ID: ${req.params.id} để cập nhật`
      );
      return res.status(404).send("Người dùng không tồn tại");
    }
    console.log(`Cập nhật người dùng với ID: ${req.params.id}`);
    res.send("Người dùng đã được cập nhật thành công");
  } catch (err) {
    console.error("Lỗi khi cập nhật người dùng:", err);
    res.status(500).send("Lỗi server");
  }
});

// Định nghĩa route DELETE /users/:id (Delete a user by ID)
router.delete("/:id", async (req, res) => {
  try {
    const pool = await conn;
    const result = await pool
      .request()
      .input("UserID", sql.Int, req.params.id)
      .query("DELETE FROM Users WHERE UserID = @UserID");
    if (result.rowsAffected[0] === 0) {
      console.log(`Không tìm thấy người dùng với ID: ${req.params.id} để xóa`);
      return res.status(404).send("Người dùng không tồn tại");
    }
    console.log(`Xóa người dùng với ID: ${req.params.id}`);
    res.send("Người dùng đã được xóa thành công");
  } catch (err) {
    console.error("Lỗi khi xóa người dùng:", err);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router; // Xuất router