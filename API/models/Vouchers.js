const { conn, sql } = require("../config/connect");

const createVoucherTable = async () => {
  const pool = await conn;
  const query = `
    CREATE TABLE Vouchers (
      VoucherID INT PRIMARY KEY IDENTITY(1,1),
      Code NVARCHAR(50) NOT NULL UNIQUE,
      DiscountPercentage DECIMAL(5, 2) NOT NULL, -- Phần trăm giảm giá
      ExpiryDate DATETIME NOT NULL, -- Ngày hết hạn
      IsActive BIT DEFAULT 1 -- Trạng thái hoạt động
    );
  `;
  await pool.request().query(query);
  console.log("Bảng Vouchers đã được tạo thành công.");
};

module.exports = { createVoucherTable };
