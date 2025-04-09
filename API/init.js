const { createRoleTable } = require("./models/Role");
const { createUserTable } = require("./models/User");
const { createUserRoleTable } = require("./models/UserRole");
const { createCategoryTable } = require("./models/Category");
const { createProductTable } = require("./models/Product");
const { createCartTable } = require("./models/Cart");
const { createCartItemTable } = require("./models/CartItem");
const { createInvoiceTable } = require("./models/Invoices");
const { createInvoiceItemTable } = require("./models/InvoiceItems");
const { createVoucherTable } = require("./models/Vouchers");
const { conn } = require("./config/connect");

async function createTableIfNotExists(createTableFunction, tableName) {
  try {
    console.log(`Đang kiểm tra và tạo bảng ${tableName} nếu chưa tồn tại...`);

    // Kiểm tra xem bảng đã tồn tại chưa
    const pool = await conn;
    const result = await pool
      .request()
      .query(
        `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${tableName}'`
      );

    if (result.recordset.length > 0) {
      console.log(`Bảng ${tableName} đã tồn tại, bỏ qua việc tạo.`);
      return;
    }

    // Nếu chưa tồn tại, tạo bảng
    await createTableFunction();
    console.log(`Bảng ${tableName} đã được tạo thành công.`);
  } catch (err) {
    console.error(`Lỗi khi kiểm tra hoặc tạo bảng ${tableName}:`, err);
    throw err;
  }
}

(async () => {
  try {
    console.log("Bắt đầu tạo các bảng trong cơ sở dữ liệu...");

    // Kết nối cơ sở dữ liệu
    const pool = await conn;

    // Tạo các bảng
    await createTableIfNotExists(createRoleTable, "Roles");
    await createTableIfNotExists(createUserTable, "Users");
    await createTableIfNotExists(createUserRoleTable, "UserRoles");
    await createTableIfNotExists(createCategoryTable, "Categories");
    await createTableIfNotExists(createProductTable, "Products");
    await createTableIfNotExists(createCartTable, "Carts");
    await createTableIfNotExists(createCartItemTable, "CartItems");
    await createTableIfNotExists(createInvoiceTable, "Invoices");
    await createTableIfNotExists(createInvoiceItemTable, "InvoiceItems");
    await createTableIfNotExists(createVoucherTable, "Vouchers");

    console.log("Tất cả các bảng đã được kiểm tra và tạo thành công!");
  } catch (err) {
    console.error("Đã xảy ra lỗi khi tạo các bảng:", err);
  } finally {
    // Đóng kết nối cơ sở dữ liệu
    if (conn) {
      conn.then((pool) => pool.close());
      console.log("Đã đóng kết nối cơ sở dữ liệu.");
    }
  }
})();
