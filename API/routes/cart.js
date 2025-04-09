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

    // Lấy giỏ hàng của người dùng
    let cart = await pool
      .request()
      .input("UserID", sql.Int, userId)
      .query("SELECT * FROM Cart WHERE UserID = @UserID");

    if (cart.recordset.length === 0) {
      // Tạo giỏ hàng mới nếu chưa có
      await pool
        .request()
        .input("UserID", sql.Int, userId)
        .query("INSERT INTO Cart (UserID) VALUES (@UserID)");

      cart = await pool
        .request()
        .input("UserID", sql.Int, userId)
        .query("SELECT * FROM Cart WHERE UserID = @UserID");
    }

    const cartId = cart.recordset[0].CartID;

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingItem = await pool
      .request()
      .input("CartID", sql.Int, cartId)
      .input("ProductID", sql.Int, ProductID)
      .query(
        "SELECT * FROM CartItem WHERE CartID = @CartID AND ProductID = @ProductID"
      );

    if (existingItem.recordset.length > 0) {
      // Nếu sản phẩm đã tồn tại, cộng dồn số lượng
      const newQuantity = existingItem.recordset[0].Quantity + Quantity;

      await pool
        .request()
        .input("CartItemID", sql.Int, existingItem.recordset[0].CartItemID)
        .input("Quantity", sql.Int, newQuantity)
        .query(
          "UPDATE CartItem SET Quantity = @Quantity WHERE CartItemID = @CartItemID"
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
      .input("CartID", sql.Int, cartId)
      .input("ProductID", sql.Int, ProductID)
      .input("Quantity", sql.Int, Quantity)
      .input("UnitPrice", sql.Decimal(10, 2), unitPrice)
      .query(
        `INSERT INTO CartItem (CartID, ProductID, Quantity, UnitPrice)
         VALUES (@CartID, @ProductID, @Quantity, @UnitPrice)`
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
    const { id } = req.params; // id là CartItemID
    const userId = req.user.UserID;

    const pool = await conn;

    // Kiểm tra xem sản phẩm có tồn tại trong giỏ hàng của người dùng không
    const cartItem = await pool
      .request()
      .input("CartItemID", sql.Int, id)
      .query(
        `SELECT ci.CartItemID
         FROM CartItem ci
         JOIN Cart c ON ci.CartID = c.CartID
         WHERE ci.CartItemID = @CartItemID AND c.UserID = ${userId}`
      );

    if (cartItem.recordset.length === 0) {
      return res
        .status(404)
        .send("Sản phẩm không tồn tại trong giỏ hàng của bạn.");
    }

    // Xóa sản phẩm khỏi giỏ hàng
    await pool
      .request()
      .input("CartItemID", sql.Int, id)
      .query("DELETE FROM CartItem WHERE CartItemID = @CartItemID");

    res.status(200).send("Sản phẩm đã được xóa khỏi giỏ hàng.");
  } catch (err) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", err);
    res.status(500).send("Lỗi server");
  }
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // id là CartItemID
    const { Quantity } = req.body; // Số lượng mới
    const userId = req.user.UserID;

    if (!Quantity || Quantity < 1) {
      return res.status(400).send("Số lượng phải lớn hơn hoặc bằng 1.");
    }

    const pool = await conn;

    // Kiểm tra xem sản phẩm có tồn tại trong giỏ hàng của người dùng không
    const cartItem = await pool
      .request()
      .input("CartItemID", sql.Int, id)
      .query(
        `SELECT ci.CartItemID
         FROM CartItem ci
         JOIN Cart c ON ci.CartID = c.CartID
         WHERE ci.CartItemID = @CartItemID AND c.UserID = ${userId}`
      );

    if (cartItem.recordset.length === 0) {
      return res
        .status(404)
        .send("Sản phẩm không tồn tại trong giỏ hàng của bạn.");
    }

    // Cập nhật số lượng sản phẩm
    await pool
      .request()
      .input("CartItemID", sql.Int, id)
      .input("Quantity", sql.Int, Quantity)
      .query(
        "UPDATE CartItem SET Quantity = @Quantity WHERE CartItemID = @CartItemID"
      );

    res.status(200).send("Số lượng sản phẩm đã được cập nhật.");
  } catch (err) {
    console.error("Lỗi khi cập nhật số lượng sản phẩm:", err);
    res.status(500).send("Lỗi server");
  }
});

// Thanh toán giỏ hàng
router.post("/checkout", authenticateToken, async (req, res) => {
  try {
    const { VoucherCode } = req.body; // Nhận mã voucher từ request
    const userId = req.user.UserID;

    const pool = await conn;

    // Lấy giỏ hàng của người dùng
    const cart = await pool
      .request()
      .input("UserID", sql.Int, userId)
      .query("SELECT * FROM Cart WHERE UserID = @UserID");

    if (cart.recordset.length === 0) {
      return res.status(404).send("Giỏ hàng trống, không thể thanh toán.");
    }

    const cartId = cart.recordset[0].CartID;

    // Lấy các sản phẩm trong giỏ hàng
    const cartItems = await pool
      .request()
      .input("CartID", sql.Int, cartId)
      .query("SELECT * FROM CartItem WHERE CartID = @CartID");

    if (cartItems.recordset.length === 0) {
      return res.status(404).send("Giỏ hàng trống, không thể thanh toán.");
    }

    // Tính tổng tiền
    let totalAmount = cartItems.recordset.reduce(
      (sum, item) => sum + item.Quantity * item.UnitPrice,
      0
    );

    // Kiểm tra voucher
    if (VoucherCode) {
      const voucher = await pool
        .request()
        .input("Code", sql.NVarChar, VoucherCode)
        .query(
          `SELECT * FROM Vouchers WHERE Code = @Code AND IsActive = 1 AND ExpiryDate > GETDATE()`
        );

      if (voucher.recordset.length === 0) {
        return res.status(400).send("Voucher không hợp lệ hoặc đã hết hạn.");
      }

      const discount = voucher.recordset[0].DiscountPercentage;
      totalAmount = totalAmount - (totalAmount * discount) / 100;
    }

    // Tạo hóa đơn
    const invoiceResult = await pool
      .request()
      .input("UserID", sql.Int, userId)
      .input("TotalAmount", sql.Decimal(10, 2), totalAmount)
      .query(
        `INSERT INTO Invoices (UserID, TotalAmount) 
         OUTPUT INSERTED.InvoiceID 
         VALUES (@UserID, @TotalAmount)`
      );

    const invoiceId = invoiceResult.recordset[0].InvoiceID;

    // Thêm các sản phẩm vào bảng InvoiceItems
    for (const item of cartItems.recordset) {
      await pool
        .request()
        .input("InvoiceID", sql.Int, invoiceId)
        .input("ProductID", sql.Int, item.ProductID)
        .input("Quantity", sql.Int, item.Quantity)
        .input("UnitPrice", sql.Decimal(10, 2), item.UnitPrice)
        .query(
          `INSERT INTO InvoiceItems (InvoiceID, ProductID, Quantity, UnitPrice)
           VALUES (@InvoiceID, @ProductID, @Quantity, @UnitPrice)`
        );
    }

    // Xóa các sản phẩm trong giỏ hàng
    await pool
      .request()
      .input("CartID", sql.Int, cartId)
      .query("DELETE FROM CartItem WHERE CartID = @CartID");

    res
      .status(200)
      .send(
        `Thanh toán thành công. Tổng tiền: ${totalAmount} VND. Hóa đơn ID: ${invoiceId}`
      );
  } catch (err) {
    console.error("Lỗi khi thanh toán:", err);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router;
