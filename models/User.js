const { conn, sql } = require("../config/connect");

async function createUserTable() {
  try {
    const pool = await conn;

    const query = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
      CREATE TABLE Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        FullName NVARCHAR(50) NOT NULL, -- Họ tên
        PhoneNumber NVARCHAR(15) NOT NULL, -- Số điện thoại
        Email NVARCHAR(50) NOT NULL UNIQUE, -- Email
        Notes NVARCHAR(MAX), -- Ghi chú
        Preferences NVARCHAR(20), -- Tùy chọn (ví dụ: có trẻ em, bàn tròn, v.v.)
        CreatedAt DATETIME DEFAULT GETDATE(), -- Thời gian tạo
        UpdatedAt DATETIME DEFAULT GETDATE() -- Thời gian cập nhật
      )
    `;

    await pool.request().query(query);
    console.log("Bảng 'Users' đã được tạo thành công.");
  } catch (err) {
    console.error("Lỗi khi tạo bảng Users:", err);
  }
}

module.exports = {
  createUserTable,
};
