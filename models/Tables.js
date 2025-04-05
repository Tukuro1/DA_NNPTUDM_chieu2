const { conn, sql } = require("../config/connect");

async function createTable() {
  try {
    const pool = await conn;

    const query = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tables' AND xtype='U')
      CREATE TABLE Tables (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(10) NOT NULL
      )
    `;

    await pool.request().query(query);
    console.log("Bảng 'Tables' đã được tạo thành công.");
  } catch (err) {
    console.error("Lỗi khi tạo bảng:", err);
  }
}

module.exports = {
  createTable,
};
