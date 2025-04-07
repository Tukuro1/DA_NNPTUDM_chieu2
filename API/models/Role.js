const { conn, sql } = require("../config/connect");

const createRoleTable = async () => {
  const pool = await conn;
  const query = `
        CREATE TABLE Roles (
            RoleID INT PRIMARY KEY IDENTITY(1,1),
            RoleName NVARCHAR(50) NOT NULL UNIQUE,
            Description NVARCHAR(255)
        );

        -- Thêm hai role mặc định
        IF NOT EXISTS (SELECT * FROM Roles WHERE RoleName = 'admin')
            INSERT INTO Roles (RoleName, Description) VALUES ('admin', 'Administrator with full access');
        IF NOT EXISTS (SELECT * FROM Roles WHERE RoleName = 'user')
            INSERT INTO Roles (RoleName, Description) VALUES ('user', 'Regular user with limited access');
    `;
  await pool.request().query(query);
  console.log("Bảng Roles đã được tạo thành công.");
};

module.exports = { createRoleTable };
