const express = require("express");
const router = express.Router();

// Định nghĩa route GET /categories
router.get("/", (req, res) => {
  res.json({ message: "Danh sách danh mục" });
});

module.exports = router; // Xuất router
