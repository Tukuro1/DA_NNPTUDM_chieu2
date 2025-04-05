const { conn, sql } = require("../config/connect");

const createUserRoleTable = async () => {
  const pool = await conn;
  const query = `
    CREATE TABLE UserRoles (
      UserRoleID INT PRIMARY KEY IDENTITY(1,1),
      UserID INT FOREIGN KEY REFERENCES Users(UserID),
      RoleID INT FOREIGN KEY REFERENCES Roles(RoleID)
    );
  `;
  await pool.request().query(query);
  console.log("Bảng UserRoles đã được tạo thành công.");
};

module.exports = { createUserRoleTable };
