const { createRoleTable } = require("./models/Role");
const { createUserTable } = require("./models/User");
const { createUserRoleTable } = require("./models/UserRole");
const { createCategoryTable } = require("./models/Category");
const { createProductTable } = require("./models/Product");
const { createOrderTable } = require("./models/Order");
const { createOrderDetailTable } = require("./models/OrderDetail");

(async () => {
  try {
    // Tạo bảng theo thứ tự phụ thuộc
    await createRoleTable();
    await createUserTable();
    await createUserRoleTable();
    await createCategoryTable();
    await createProductTable();
    await createOrderTable();
    await createOrderDetailTable();

    console.log("Tất cả các bảng đã được tạo thành công!");
  } catch (err) {
    console.error("Lỗi khi chạy init.js:", err);
  }
})();
