const { conn, sql } = require("../config/connect");

async function createRoleTable() {
  try {
    const pool = await conn;

    const query = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Roles' AND xtype='U')
      CREATE TABLE Roles (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(50) NOT NULL UNIQUE, -- Tên vai trò (Admin, Staff, Manager, etc.)
        Description NVARCHAR(255) -- Mô tả vai trò
      )
    `;

    await pool.request().query(query);
    console.log("Bảng 'Roles' đã được tạo thành công.");
  } catch (err) {
    console.error("Lỗi khi tạo bảng Roles:", err);
  }
}

module.exports = {
  createRoleTable,
};
