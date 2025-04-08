const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { conn, sql } = require("../config/connect");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();
const SECRET_KEY = "your_secret_key"; // Thay bằng khóa bí mật của bạn

// Đăng ký tài khoản
router.post("/register", async (req, res) => {
  try {
    const { Username, Password, Email, FullName, Phone, Address } = req.body;

    if (!Username || !Password || !Email) {
      return res.status(400).send("Thiếu thông tin bắt buộc");
    }

    const pool = await conn;

    // Kiểm tra xem Username hoặc Email đã tồn tại chưa
    const checkUser = await pool
      .request()
      .input("Username", sql.NVarChar, Username)
      .input("Email", sql.NVarChar, Email)
      .query(
        "SELECT * FROM Users WHERE Username = @Username OR Email = @Email"
      );

    if (checkUser.recordset.length > 0) {
      return res.status(400).send("Username hoặc Email đã tồn tại");
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Thêm user mới với role mặc định là "user"
    await pool
      .request()
      .input("Username", sql.NVarChar, Username)
      .input("Password", sql.NVarChar, hashedPassword)
      .input("Email", sql.NVarChar, Email)
      .input("FullName", sql.NVarChar, FullName)
      .input("Phone", sql.NVarChar, Phone)
      .input("Address", sql.NVarChar, Address)
      .query(
        `INSERT INTO Users (Username, Password, Email, FullName, Phone, Address)
         VALUES (@Username, @Password, @Email, @FullName, @Phone, @Address)`
      );

    // Gán role "user" cho tài khoản vừa tạo
    const userId = await pool
      .request()
      .input("Username", sql.NVarChar, Username)
      .query("SELECT UserID FROM Users WHERE Username = @Username");

    await pool
      .request()
      .input("UserID", sql.Int, userId.recordset[0].UserID)
      .input("RoleID", sql.Int, 2) // RoleID = 2 là "user"
      .query(
        "INSERT INTO UserRoles (UserID, RoleID) VALUES (@UserID, @RoleID)"
      );

    res.status(201).send("Đăng ký thành công");
  } catch (err) {
    console.error("Lỗi khi đăng ký:", err);
    res.status(500).send("Lỗi server");
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { Username, Password } = req.body;

    if (!Username || !Password) {
      return res.status(400).send("Thiếu thông tin đăng nhập");
    }

    const pool = await conn;

    // Tìm user theo Username
    const user = await pool
      .request()
      .input("Username", sql.NVarChar, Username)
      .query("SELECT * FROM Users WHERE Username = @Username");

    if (user.recordset.length === 0) {
      return res.status(404).send("Tài khoản không tồn tại");
    }

    const userData = user.recordset[0];

    // Kiểm tra mật khẩu đã mã hóa
    const isPasswordValid = await bcrypt.compare(Password, userData.Password);

    // Kiểm tra mật khẩu không mã hóa
    const isPlainPasswordValid = Password === userData.Password;

    if (!isPasswordValid && !isPlainPasswordValid) {
      return res.status(401).send("Mật khẩu không chính xác");
    }

    // Lấy role của user
    const roles = await pool
      .request()
      .input("UserID", sql.Int, userData.UserID)
      .query(
        `SELECT r.RoleName FROM UserRoles ur
         JOIN Roles r ON ur.RoleID = r.RoleID
         WHERE ur.UserID = @UserID`
      );

    // Tạo token
    const token = jwt.sign(
      {
        UserID: userData.UserID,
        Username: userData.Username,
        Roles: roles.recordset.map((role) => role.RoleName),
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Lỗi khi đăng nhập:", err);
    res.status(500).send("Lỗi server");
  }
});

// Lấy thông tin cá nhân
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.UserID;

    const pool = await conn;

    const user = await pool
      .request()
      .input("UserID", sql.Int, userId)
      .query(
        "SELECT UserID, Username, Email, FullName, Phone, Address FROM Users WHERE UserID = @UserID"
      );

    if (user.recordset.length === 0) {
      return res.status(404).send("Không tìm thấy thông tin người dùng");
    }

    res.json(user.recordset[0]);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin cá nhân:", err);
    res.status(500).send("Lỗi server");
  }
});

// Cập nhật thông tin cá nhân
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { Email, FullName, Phone, Address } = req.body;
    const userId = req.user.UserID;

    if (!FullName && !Phone && !Address) {
      return res.status(400).send("Không có thông tin nào để cập nhật");
    }

    const pool = await conn;

    // Cập nhật thông tin người dùng
    await pool
      .request()
      .input("UserID", sql.Int, userId)
      .input("Email", sql.NVarChar, Email || null)
      .input("FullName", sql.NVarChar, FullName || null)
      .input("Phone", sql.NVarChar, Phone || null)
      .input("Address", sql.NVarChar, Address || null)
      .query(
        `UPDATE Users
         SET Email = ISNULL(@Email, Email),
             FullName = ISNULL(@FullName, FullName),
             Phone = ISNULL(@Phone, Phone),
             Address = ISNULL(@Address, Address)
         WHERE UserID = @UserID`
      );

    res.status(200).send("Thông tin cá nhân đã được cập nhật thành công");
  } catch (err) {
    console.error("Lỗi khi cập nhật thông tin cá nhân:", err);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router;
