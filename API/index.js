var express = require("express");
var app = require("./app"); // Import app.js
var bodyParser = require("body-parser");
const { conn, sql } = require("./config/connect");
app.use(bodyParser.json());

//mở cổng server
app.listen(3000, function () {
  console.log("Ứng dụng đang chạy tại địa chỉ: http://localhost:3000");
});
