const express = require("express");
const router = express.Router();
const { conn, sql } = require("../config/connect"); // Đảm bảo bạn có tệp connect.js để kết nối DB
const userController = require("../controllers/users"); // Import userController

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
    const { UserName, Password, Email } = req.body;

    // Kiểm tra nếu thiếu dữ liệu
    if (!UserName || !Password || !Email) {
      console.log("Thiếu thông tin người dùng khi thêm mới");
      return res.status(400).send("Thiếu thông tin người dùng");
    }

    const pool = await conn;

    // Thêm người dùng mới
    const userResult = await pool
      .request()
      .input("UserName", sql.NVarChar, UserName)
      .input("Password", sql.NVarChar, Password)
      .input("Email", sql.NVarChar, Email)
      .query(
        `INSERT INTO Users (UserName, Password, Email)
         OUTPUT INSERTED.UserID
         VALUES (@UserName, @Password, @Email)`
      );

    const userID = userResult.recordset[0].UserID;

    // Lấy RoleID của role "user"
    const roleResult = await pool
      .request()
      .input("RoleName", sql.NVarChar, "user")
      .query("SELECT RoleID FROM Roles WHERE RoleName = @RoleName");

    if (roleResult.recordset.length === 0) {
      throw new Error("Role 'user' không tồn tại.");
    }

    const roleID = roleResult.recordset[0].RoleID;

    // Gán role "user" cho người dùng trong bảng UserRoles
    await pool
      .request()
      .input("UserID", sql.Int, userID)
      .input("RoleID", sql.Int, roleID)
      .query(
        `INSERT INTO UserRoles (UserID, RoleID)
         VALUES (@UserID, @RoleID)`
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
    const { UserName, Password, Email } = req.body;
    const pool = await conn;

    // Cập nhật thông tin người dùng
    const result = await pool
      .request()
      .input("UserID", sql.Int, req.params.id)
      .input("UserName", sql.NVarChar, UserName)
      .input("Password", sql.NVarChar, Password)
      .input("Email", sql.NVarChar, Email)
      .query(
        `UPDATE Users
         SET UserName = @UserName, Password = @Password, Email = @Email
         WHERE UserID = @UserID`
      );

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("Người dùng không tồn tại");
    }

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

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const result = await userController.createUser(username, password, email);
    res.status(201).json(result);
  } catch (err) {
    console.error("Lỗi khi đăng ký:", err);
    res.status(400).json({ error: err.message });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await userController.checkLogin(username, password);
    res.status(200).json(result);
  } catch (err) {
    console.error("Lỗi khi đăng nhập:", err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; // Xuất router
