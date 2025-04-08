const { conn, sql } = require("../config/connect");

const createUserTable = async () => {
  const pool = await conn;
  const query = `
    CREATE TABLE Users (
      UserID INT PRIMARY KEY IDENTITY(1,1),
      Username NVARCHAR(50) NOT NULL UNIQUE,
      Password NVARCHAR(255) NOT NULL,
      Email NVARCHAR(100),
      FullName NVARCHAR(100),
      Phone NVARCHAR(15),
      Address NVARCHAR(255),
      CreatedAt DATETIME DEFAULT GETDATE()
    );
  `;
  await pool.request().query(query);
  console.log("Bảng Users đã được tạo thành công.");
};

module.exports = { createUserTable };
