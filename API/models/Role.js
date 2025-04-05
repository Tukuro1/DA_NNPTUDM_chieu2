const { conn, sql } = require("../config/connect");

const createRoleTable = async () => {
  const pool = await conn;
  const query = `
    CREATE TABLE Roles (
      RoleID INT PRIMARY KEY IDENTITY(1,1),
      RoleName NVARCHAR(50) NOT NULL UNIQUE,
      Description NVARCHAR(255)
    );
  `;
  await pool.request().query(query);
  console.log("Bảng Roles đã được tạo thành công.");
};

module.exports = { createRoleTable };
