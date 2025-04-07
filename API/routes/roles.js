const express = require("express");
const router = express.Router();

// Định nghĩa hai role cố định
const roles = [
  { id: 1, roleName: "admin", description: "Administrator with full access" },
  { id: 2, roleName: "user", description: "Regular user with limited access" },
];

// Định nghĩa route GET /roles (Read all roles)
router.get("/", async function(req, res, next) {
  res.send(roles); // Trả về danh sách các role
});

// Định nghĩa route GET /roles/:id (Read a single role by ID)
router.get("/:id", async function(req, res, next) {
  try {
    const role = roles.find((r) => r.id == req.params.id);
    if (!role) {
      return res.status(404).send({
        success: false,
        message: "Role không tồn tại"
      });
    }
    res.status(200).send({
      success: true,
      data: role
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; // Xuất router