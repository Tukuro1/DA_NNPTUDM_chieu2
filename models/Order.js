const { conn, sql } = require("../config/connect");

const createOrderTable = async () => {
  const pool = await conn;
  const query = `
    CREATE TABLE Orders (
      OrderID INT PRIMARY KEY IDENTITY(1,1),
      UserID INT FOREIGN KEY REFERENCES Users(UserID),
      OrderDate DATETIME DEFAULT GETDATE(),
      TotalAmount DECIMAL(10, 2) NOT NULL,
      Status NVARCHAR(20) DEFAULT 'Pending',
      ShippingAddress NVARCHAR(255)
    );
  `;
  await pool.request().query(query);
  console.log("Bảng Orders đã được tạo thành công.");
};

module.exports = { createOrderTable };
