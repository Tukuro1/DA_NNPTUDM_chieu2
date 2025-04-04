const sql = require("mssql");

const config = {
  user: "sa",
  password: "1",
  server: "DESKTOP-996V6GP", // hoặc localhost\\SQLEXPRESS nếu là instance
  database: "DA_QLNH",
  options: {
    encrypt: false, // nếu không dùng SSL
    trustServerCertificate: true,
  },
};

const conn = new sql.ConnectionPool(config).connect().then((pool) => {
  return pool;
});

module.exports = {
  conn: conn,
  sql: sql,
};
