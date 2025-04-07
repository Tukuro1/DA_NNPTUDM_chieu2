const express = require("express");
const router = express.Router();

// Định nghĩa hai role cố định
const roles = [
  { id: 1, roleName: "admin", description: "Administrator with full access" },
  { id: 2, roleName: "user", description: "Regular user with limited access" },
];

module.exports = router; // Xuất router
