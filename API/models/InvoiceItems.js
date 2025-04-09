const { conn, sql } = require("../config/connect");

const createInvoiceItemTable = async () => {
  const pool = await conn;
  const query = `
      CREATE TABLE InvoiceItems (
        InvoiceItemID INT PRIMARY KEY IDENTITY(1,1),
        InvoiceID INT FOREIGN KEY REFERENCES Invoices(InvoiceID),
        ProductID INT FOREIGN KEY REFERENCES Products(ProductID),
        Quantity INT NOT NULL,
        UnitPrice DECIMAL(10, 2) NOT NULL,
        TotalPrice AS (Quantity * UnitPrice) PERSISTED
      );
    `;
  await pool.request().query(query);
  console.log("Bảng InvoiceItems đã được tạo thành công.");
};
module.exports = { createInvoiceItemTable };
