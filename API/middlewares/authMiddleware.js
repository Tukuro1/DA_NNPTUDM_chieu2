const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key"; // Thay bằng khóa bí mật của bạn

// Middleware xác thực token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Token không được cung cấp");
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).send("Token không hợp lệ");
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
