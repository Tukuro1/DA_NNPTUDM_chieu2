const { conn, sql } = require("../config/connect");

const createCartTable = async () => {
  const pool = await conn;
  const query = `
    CREATE TABLE Cart (
      CartID INT PRIMARY KEY IDENTITY(1,1),
      UserID INT FOREIGN KEY REFERENCES Users(UserID),
      CreatedAt DATETIME DEFAULT GETDATE()
    );
  `;
  await pool.request().query(query);
  console.log("Bảng Cart đã được tạo thành công.");
};

module.exports = { createCartTable };
