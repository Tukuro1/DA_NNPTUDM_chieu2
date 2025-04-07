const { createRoleTable } = require("./models/Role");
const { createUserTable } = require("./models/User");
const { createUserRoleTable } = require("./models/UserRole");
const { createCategoryTable } = require("./models/Category");
const { createProductTable } = require("./models/Product");
const { createOrderTable } = require("./models/Order");
const { createOrderDetailTable } = require("./models/OrderDetail");
const { conn } = require("./dbConnection");

const checkAndCreateTable = async (createTableFn, tableName) => {
  try {
    const pool = await conn;
    const result = await pool.request().query(
      `IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='${tableName}' AND xtype='U')
         BEGIN
           EXEC sp_executesql N'${createTableFn.toString()}'
         END`
    );
    console.log(`Bảng ${tableName} đã được kiểm tra và tạo nếu cần.`);
  } catch (err) {
    console.error(`Lỗi khi kiểm tra hoặc tạo bảng ${tableName}:`, err);
  }
};

// Sử dụng hàm checkAndCreateTable
(async () => {
  try {
    await checkAndCreateTable(createRoleTable, "Roles");
    await checkAndCreateTable(createUserTable, "Users");
    await checkAndCreateTable(createUserRoleTable, "UserRoles");
    await checkAndCreateTable(createCategoryTable, "Categories");
    await checkAndCreateTable(createProductTable, "Products");
    await checkAndCreateTable(createOrderTable, "Orders");
    await checkAndCreateTable(createOrderDetailTable, "OrderDetails");

    console.log("Tất cả các bảng đã được kiểm tra và tạo thành công!");
  } catch (err) {
    console.error("Lỗi khi chạy init.js:", err);
  }
})();
