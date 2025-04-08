const { conn, sql } = require("../config/connect");

const createCartItemTable = async () => {
  const pool = await conn;
  const query = `
    CREATE TABLE CartItem (
      CartItemID INT PRIMARY KEY IDENTITY(1,1),
      CartID INT FOREIGN KEY REFERENCES Cart(CartID),
      ProductID INT FOREIGN KEY REFERENCES Products(ProductID),
      Quantity INT NOT NULL,
      UnitPrice DECIMAL(10, 2) NOT NULL,
      TotalPrice AS (Quantity * UnitPrice) PERSISTED
    );
  `;
  await pool.request().query(query);
  console.log("Bảng CartItem đã được tạo thành công.");
};

module.exports = { createCartItemTable };
