const express = require("express");
const router = express.Router();

// Route trang chủ
router.get("/", (req, res) => {
  res.send("<h1>Chào mừng đến với chúng tôi</h1>");
});

module.exports = router;
