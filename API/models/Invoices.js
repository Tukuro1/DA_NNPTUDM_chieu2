const { conn, sql } = require("../config/connect");

const createInvoiceTable = async () => {
  const pool = await conn;
  const query = `
    CREATE TABLE Invoices (
      InvoiceID INT PRIMARY KEY IDENTITY(1,1),
      UserID INT FOREIGN KEY REFERENCES Users(UserID),
      TotalAmount DECIMAL(10, 2) NOT NULL,
      IsConfirmed BIT DEFAULT 0, -- Chưa xác nhận (0) hoặc đã xác nhận (1)
      CreatedAt DATETIME DEFAULT GETDATE()
    );
  `;
  await pool.request().query(query);
  console.log("Bảng Invoices đã được tạo thành công.");
};
module.exports = { createInvoiceTable };
