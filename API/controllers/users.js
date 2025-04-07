let userSchema = require("../models/users");
let roleSchema = require("../models/roles");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
let constants = require("../Utils/constants");
const { conn, sql } = require("../config/connect");

module.exports = {
  getUserById: async function (id) {
    return await userSchema.findById(id).populate("role");
  },
  getUserByEmail: async function (email) {
    return await userSchema
      .findOne({
        email: email,
      })
      .populate("role");
  },
  createUser: async function (username, password, email) {
    const pool = await conn;

    // Kiểm tra xem username hoặc email đã tồn tại chưa
    const existingUser = await pool
      .request()
      .input("Username", sql.NVarChar, username)
      .input("Email", sql.NVarChar, email)
      .query(
        `SELECT * FROM Users WHERE Username = @Username OR Email = @Email`
      );

    if (existingUser.recordset.length > 0) {
      throw new Error("Username hoặc Email đã tồn tại.");
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lấy RoleID của role "user"
    const roleResult = await pool
      .request()
      .input("RoleName", sql.NVarChar, "user")
      .query("SELECT RoleID FROM Roles WHERE RoleName = @RoleName");

    if (roleResult.recordset.length === 0) {
      throw new Error("Role 'user' không tồn tại.");
    }

    const roleID = roleResult.recordset[0].RoleID;

    // Thêm người dùng mới
    const userResult = await pool
      .request()
      .input("Username", sql.NVarChar, username)
      .input("Password", sql.NVarChar, hashedPassword)
      .input("Email", sql.NVarChar, email)
      .query(
        `INSERT INTO Users (Username, Password, Email)
         OUTPUT INSERTED.UserID
         VALUES (@Username, @Password, @Email)`
      );

    const userID = userResult.recordset[0].UserID;

    // Gán role "user" cho người dùng trong bảng UserRoles
    await pool
      .request()
      .input("UserID", sql.Int, userID)
      .input("RoleID", sql.Int, roleID)
      .query(
        `INSERT INTO UserRoles (UserID, RoleID)
         VALUES (@UserID, @RoleID)`
      );

    return { message: "Đăng ký thành công!" };
  },

  checkLogin: async function (username, password) {
    const pool = await conn;

    // Tìm người dùng theo username
    const userResult = await pool
      .request()
      .input("Username", sql.NVarChar, username)
      .query(
        `SELECT u.UserID, u.Password, r.RoleName
         FROM Users u
         JOIN UserRoles ur ON u.UserID = ur.UserID
         JOIN Roles r ON ur.RoleID = r.RoleID
         WHERE u.Username = @Username`
      );

    if (userResult.recordset.length === 0) {
      throw new Error("Tài khoản không tồn tại.");
    }

    const user = userResult.recordset[0];

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      throw new Error("Mật khẩu không chính xác.");
    }

    // Tạo token JWT
    const token = jwt.sign(
      { userID: user.UserID, role: user.RoleName },
      constants.SECRET_KEY,
      { expiresIn: "1h" }
    );

    return { message: "Đăng nhập thành công!", token };
  },
};
