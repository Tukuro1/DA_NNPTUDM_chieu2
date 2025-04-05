const { createRoleTable } = require("./models/Role");
const { createStaffTable } = require("./models/Staff");
const { createUserTable } = require("./models/User");
const { createTable } = require("./models/Tables");

(async () => {
  try {
    // Tạo bảng Roles trước vì Staff phụ thuộc vào nó
    await createRoleTable();

    // Tạo bảng Staff
    await createStaffTable();

    // Tạo bảng Users trước vì Tables phụ thuộc vào nó
    await createUserTable();

    // Tạo bảng Tables
    await createTable();

    console.log("Tất cả các bảng đã được tạo thành công!");
  } catch (err) {
    console.error("Lỗi khi chạy init.js:", err);
  }
})();
