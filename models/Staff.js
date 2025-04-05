const { conn, sql } = require("../config/connect");

async function createStaffTable() {
  try {
    const pool = await conn;

    const query = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Staff' AND xtype='U')
      CREATE TABLE Staff (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        FullName NVARCHAR(50) NOT NULL, -- Họ tên nhân viên
        PhoneNumber NVARCHAR(15) NOT NULL, -- Số điện thoại
        Email NVARCHAR(30) NOT NULL UNIQUE, -- Email
        Address NVARCHAR(100) NOT NULL, -- Địa chỉ
        RoleId INT NOT NULL, -- Vai trò (liên kết với bảng Roles)
        CreatedAt DATETIME DEFAULT GETDATE(), -- Thời gian tạo
        UpdatedAt DATETIME DEFAULT GETDATE(), -- Thời gian cập nhật
        FOREIGN KEY (RoleId) REFERENCES Roles(Id) -- Khóa ngoại liên kết với bảng Roles
      )
    `;

    await pool.request().query(query);
    console.log("Bảng 'Staff' đã được tạo thành công.");
  } catch (err) {
    console.error("Lỗi khi tạo bảng Staff:", err);
  }
}

module.exports = {
  createStaffTable,
};
