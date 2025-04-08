const express = require("express");
const router = express.Router();
const { conn, sql } = require("../config/connect");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Lấy giỏ hàng của người dùng
router.get("/", authenticateToken, async (req, res) => {
  try {
    const pool = await conn;
    const userId = req.user.UserID;

    const cart = await pool
      .request()
      .input("UserID", sql.Int, userId)
      .query("SELECT * FROM Cart WHERE UserID = @UserID");

    if (cart.recordset.length === 0) {
      return res.status(404).send("Giỏ hàng trống.");
    }

    const cartItems = await pool
      .request()
      .input("CartID", sql.Int, cart.recordset[0].CartID)
      .query(
        `SELECT ci.*, p.Name, p.ImageURL 
         FROM CartItem ci
         JOIN Products p ON ci.ProductID = p.ProductID
         WHERE ci.CartID = @CartID`
      );

    res.json({ cart: cart.recordset[0], items: cartItems.recordset });
  } catch (err) {
    console.error("Lỗi khi lấy giỏ hàng:", err);
    res.status(500).send("Lỗi server");
  }
});

// Thêm sản phẩm vào giỏ hàng
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { ProductID, Quantity } = req.body;
    const userId = req.user.UserID;

    if (!ProductID || !Quantity) {
      return res.status(400).send("Thiếu thông tin sản phẩm hoặc số lượng.");
    }

    const pool = await conn;

    // Lấy đơn hàng "Pending" của người dùng
    let order = await pool
      .request()
      .input("UserID", sql.Int, userId)
      .input("Status", sql.NVarChar, "Pending")
      .query(
        "SELECT * FROM Orders WHERE UserID = @UserID AND Status = @Status"
      );

    if (order.recordset.length === 0) {
      // Tạo đơn hàng mới nếu chưa có
      await pool
        .request()
        .input("UserID", sql.Int, userId)
        .input("TotalAmount", sql.Decimal(10, 2), 0)
        .query(
          "INSERT INTO Orders (UserID, TotalAmount, Status) VALUES (@UserID, @TotalAmount, 'Pending')"
        );

      order = await pool
        .request()
        .input("UserID", sql.Int, userId)
        .input("Status", sql.NVarChar, "Pending")
        .query(
          "SELECT * FROM Orders WHERE UserID = @UserID AND Status = @Status"
        );
    }

    const orderId = order.recordset[0].OrderID;

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingItem = await pool
      .request()
      .input("OrderID", sql.Int, orderId)
      .input("ProductID", sql.Int, ProductID)
      .query(
        "SELECT * FROM OrderDetails WHERE OrderID = @OrderID AND ProductID = @ProductID"
      );

    if (existingItem.recordset.length > 0) {
      // Nếu sản phẩm đã tồn tại, cộng dồn số lượng
      const newQuantity = existingItem.recordset[0].Quantity + Quantity;

      await pool
        .request()
        .input(
          "OrderDetailID",
          sql.Int,
          existingItem.recordset[0].OrderDetailID
        )
        .input("Quantity", sql.Int, newQuantity)
        .query(
          "UPDATE OrderDetails SET Quantity = @Quantity WHERE OrderDetailID = @OrderDetailID"
        );

      return res.status(200).send("Cập nhật số lượng sản phẩm trong giỏ hàng.");
    }

    // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
    const product = await pool
      .request()
      .input("ProductID", sql.Int, ProductID)
      .query("SELECT * FROM Products WHERE ProductID = @ProductID");

    if (product.recordset.length === 0) {
      return res.status(404).send("Sản phẩm không tồn tại.");
    }

    const unitPrice = product.recordset[0].Price;

    await pool
      .request()
      .input("OrderID", sql.Int, orderId)
      .input("ProductID", sql.Int, ProductID)
      .input("Quantity", sql.Int, Quantity)
      .input("UnitPrice", sql.Decimal(10, 2), unitPrice)
      .query(
        `INSERT INTO OrderDetails (OrderID, ProductID, Quantity, UnitPrice)
         VALUES (@OrderID, @ProductID, @Quantity, @UnitPrice)`
      );

    res.status(201).send("Sản phẩm đã được thêm vào giỏ hàng.");
  } catch (err) {
    console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", err);
    res.status(500).send("Lỗi server");
  }
});

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await conn;
    await pool
      .request()
      .input("CartItemID", sql.Int, id)
      .query("DELETE FROM CartItem WHERE CartItemID = @CartItemID");

    res.send("Sản phẩm đã được xóa khỏi giỏ hàng.");
  } catch (err) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", err);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router;
