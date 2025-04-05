const { conn, sql } = require("../config/connect");

const createProductTable = async () => {
  const pool = await conn;
  const query = `
    CREATE TABLE Products (
      ProductID INT PRIMARY KEY IDENTITY(1,1),
      Name NVARCHAR(100) NOT NULL,
      Description NVARCHAR(255),
      Price DECIMAL(10, 2) NOT NULL,
      Stock INT NOT NULL,
      ImageURL NVARCHAR(255),
      Size NVARCHAR(50), -- Thêm kích thước
      Color NVARCHAR(50), -- Thêm màu sắc
      CategoryID INT FOREIGN KEY REFERENCES Categories(CategoryID),
      CreatedAt DATETIME DEFAULT GETDATE()
    );
  `;
  await pool.request().query(query);
  console.log("Bảng Products đã được tạo thành công.");
};

module.exports = { createProductTable };
