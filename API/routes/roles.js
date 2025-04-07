const express = require("express");
const router = express.Router();
const { conn, sql } = require("../config/connect"); // Đảm bảo bạn có tệp connect.js để kết nối DB

// Định nghĩa route GET /roles (Read all roles)
router.get("/", async (req, res) => {
  try {
    const pool = await conn; // Kết nối tới cơ sở dữ liệu
    const result = await pool.request().query("SELECT * FROM Roles"); // Truy vấn bảng Roles
    res.json(result.recordset); // Trả về danh sách vai trò
  } catch (err) {
    console.error("Lỗi khi lấy dữ liệu vai trò:", err);
    res.status(500).send("Lỗi server");
  }
});

 // Định nghĩa route GET /roles/:id (Read a single role by ID)
router.get("/:id", async (req, res) => {
  try {
    const roleId = parseInt(req.params.id, 10); // Chuyển đổi id thành số nguyên
    if (isNaN(roleId)) {
      console.log(`ID không hợp lệ: ${req.params.id}`);
      return res.status(400).send("ID vai trò không hợp lệ");
    }

    const pool = await conn;
    const result = await pool
      .request()
      .input("RoleID", sql.Int, roleId) // Sử dụng RoleID thay vì ProductID
      .query("SELECT * FROM Roles WHERE RoleID = @RoleID"); // Truy vấn bảng Roles

    if (result.recordset.length === 0) {
      console.log(`Không tìm thấy vai trò với ID: ${roleId}`);
      return res.status(404).send("Vai trò không tồn tại");
    }

    console.log(`Lấy thông tin vai trò với ID: ${roleId}`);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Lỗi khi lấy vai trò:", err);
    res.status(500).send("Lỗi server");
  }
});
// Định nghĩa route POST /roles (Create a new role)
router.post("/", async (req, res) => {
  try {
    const { RoleName, Description } = req.body || {}; // Thêm fallback để tránh lỗi destructure

    // Kiểm tra nếu thiếu dữ liệu
    if (!RoleName) {
      console.log("Thiếu thông tin vai trò khi thêm mới");
      return res.status(400).send("Thiếu thông tin vai trò");
    }

    const pool = await conn;
    await pool
      .request()
      .input("RoleName", sql.NVarChar, RoleName)
      .input("Description", sql.NVarChar, Description || "")
      .query(
        `INSERT INTO Roles (RoleName, Description)
         VALUES (@RoleName, @Description)`
      );
    console.log(`Thêm vai trò mới: ${RoleName}`);
    res.status(201).send("Vai trò đã được thêm thành công");
  } catch (err) {
    console.error("Lỗi khi thêm vai trò:", err);
    res.status(500).send("Lỗi server");
  }
});

// Định nghĩa route PUT /roles/:id (Update a role by ID)
router.put("/:id", async (req, res) => {
  try {
    const { RoleName, Description } = req.body;
    const pool = await conn;
    const result = await pool
      .request()
      .input("RoleID", sql.Int, req.params.id)
      .input("RoleName", sql.NVarChar, RoleName)
      .input("Description", sql.NVarChar, Description)
      .query(
        `UPDATE Roles
         SET RoleName = @RoleName, Description = @Description
         WHERE RoleID = @RoleID`
      );
    if (result.rowsAffected[0] === 0) {
      console.log(
        `Không tìm thấy vai trò với ID: ${req.params.id} để cập nhật`
      );
      return res.status(404).send("Vai trò không tồn tại");
    }
    console.log(`Cập nhật vai trò với ID: ${req.params.id}`);
    res.send("Vai trò đã được cập nhật thành công");
  } catch (err) {
    console.error("Lỗi khi cập nhật vai trò:", err);
    res.status(500).send("Lỗi server");
  }
});

// Định nghĩa route DELETE /roles/:id (Delete a role by ID)
router.delete("/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10); // Chuyển đổi id thành số nguyên
    if (isNaN(productId)) {
      console.log(`ID không hợp lệ: ${req.params.id}`);
      return res.status(400).send("ID sản phẩm không hợp lệ");
    }

    const pool = await conn;
    const result = await pool
      .request()
      .input("ProductID", sql.Int, productId)
      .query("DELETE FROM Products WHERE ProductID = @ProductID");

    if (result.rowsAffected[0] === 0) {
      console.log(`Không tìm thấy sản phẩm với ID: ${productId} để xóa`);
      return res.status(404).send("Sản phẩm không tồn tại");
    }

    console.log(`Xóa sản phẩm với ID: ${productId}`);
    res.send("Sản phẩm đã được xóa thành công");
  } catch (err) {
    console.error("Lỗi khi xóa sản phẩm:", err);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router; // Xuất router