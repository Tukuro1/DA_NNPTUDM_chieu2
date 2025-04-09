const sql = require("mssql");

const config = {
  user: "sa",
  password: "1",
  server: "MSI", // hoặc localhost\\SQLEXPRESS nếu là instance
  database: "DA_QLBH",
  options: {
    encrypt: true, // Bật mã hóa
    trustServerCertificate: true, // Chấp nhận chứng chỉ tự ký
  },
};

const conn = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Kết nối cơ sở dữ liệu thành công.");
    return pool;
  })
  .catch((err) => {
    console.error("Lỗi kết nối cơ sở dữ liệu:", err);
  });

module.exports = {
  conn: conn,
  sql: sql,
};
