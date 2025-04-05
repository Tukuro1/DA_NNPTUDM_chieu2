const { conn, sql } = require("../config/connect");

const createOrderDetailTable = async () => {
  const pool = await conn;
  const query = `
    CREATE TABLE OrderDetails (
      OrderDetailID INT PRIMARY KEY IDENTITY(1,1),
      OrderID INT FOREIGN KEY REFERENCES Orders(OrderID),
      ProductID INT FOREIGN KEY REFERENCES Products(ProductID),
      Quantity INT NOT NULL,
      UnitPrice DECIMAL(10, 2) NOT NULL,
      TotalPrice AS (Quantity * UnitPrice) PERSISTED
    );
  `;
  await pool.request().query(query);
  console.log("Bảng OrderDetails đã được tạo thành công.");
};

module.exports = { createOrderDetailTable };
