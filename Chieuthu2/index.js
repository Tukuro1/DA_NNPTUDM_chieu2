var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const { conn, sql } = require("./connect");
app.use(bodyParser.json());

//các route
app.get("", function (reg, res) {
  res.send("Hello");
});

// Get => http://localhost:3000/tables
app.get("/tables", async function (reg, res) {
  // SELECT * FROM Tables
  var pool = await conn;
  var sqlString = "SELECT * FROM Tables";
  return await pool.request().query(sqlString, function (err, data) {
    res.send({ result: data.recordset });
  });
});

//mở cổng server
app.listen(3000, function () {
  console.log("Ứng dụng đang chạy tại địa chỉ: http://localhost:3000");
});
