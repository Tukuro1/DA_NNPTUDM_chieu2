const { conn, sql } = require("../config/connect");

const createCategoryTable = async () => {
  const pool = await conn;
  const query = `
    CREATE TABLE Categories (
      CategoryID INT PRIMARY KEY IDENTITY(1,1),
      Name NVARCHAR(100) NOT NULL,
      Description NVARCHAR(255),
      CreatedAt DATETIME DEFAULT GETDATE()
    );
  `;
  await pool.request().query(query);
  console.log("Bảng Categories đã được tạo thành công.");
};

module.exports = { createCategoryTable };
