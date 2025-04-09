const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const cors = require('cors');

// Sử dụng body-parser để parse JSON và form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình thư mục tĩnh cho CSS, JS, hình ảnh
app.use(express.static(path.join(__dirname, "public")));
app.use(cors()); 
app.use(cors({
    origin: 'http://localhost:8080'  // Thay bằng URL của web mà bạn muốn cho phép
  }));

// Import các route
const homeRoutes = require("./routes/home");
const categoriesRouter = require("./routes/categories");
const productsRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const cartRouter = require("./routes/cart");
const invoiceRoutes = require("./routes/invoices");
const voucherRouter = require("./routes/vouchers");

// Sử dụng các route
app.use("/", homeRoutes);
app.use("/categories", categoriesRouter);
app.use("/products", productsRouter);
app.use("/", authRouter);
app.use("/cart", cartRouter);
app.use("/invoices", invoiceRoutes);
app.use("/vouchers", voucherRouter);

// Import các route admin
const adminHomeRouter = require("./routes/admin/adminHome");
const adminCategoriesRouter = require("./routes/admin/adminCategories");
const adminProductsRouter = require("./routes/admin/adminProducts");
const adminUserRoutes = require("./routes/admin/adminUser");
const adminInvoicesRoutes = require("./routes/admin/adminInvoices");
const adminVouchersRouter = require("./routes/admin/adminVouchers");

// Sử dụng các route admin
app.use("/admin", adminHomeRouter);
app.use("/admin/categories", adminCategoriesRouter);
app.use("/admin/products", adminProductsRouter);
app.use("/admin/users", adminUserRoutes);
app.use("/admin/invoices", adminInvoicesRoutes);
app.use("/admin/vouchers", adminVouchersRouter);

module.exports = app;
