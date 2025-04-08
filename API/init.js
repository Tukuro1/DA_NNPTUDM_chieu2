const { createRoleTable } = require("./models/Role");
const { createUserTable } = require("./models/User");
const { createUserRoleTable } = require("./models/UserRole");
const { createCategoryTable } = require("./models/Category");
const { createProductTable } = require("./models/Product");
const { createCartTable } = require("./models/Cart");
const { createCartItemTable } = require("./models/CartItem");
const { conn } = require("./config/connect");

async function createTableIfNotExists(createTableFunction, tableName) {
  try {
    console.log(`Đang kiểm tra và tạo bảng ${tableName} nếu chưa tồn tại...`);
    await createTableFunction();
    console.log(`Bảng ${tableName} đã được tạo thành công (hoặc đã tồn tại).`);
  } catch (err) {
    if (
      err.originalError &&
      err.originalError.message.includes(
        `There is already an object named '${tableName}'`
      )
    ) {
      console.log(`Bảng ${tableName} đã tồn tại, bỏ qua việc tạo.`);
    } else {
      throw err;
    }
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
