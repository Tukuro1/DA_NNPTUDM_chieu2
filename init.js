const { createTable } = require("./models/Tables");
const { createUserTable } = require("./models/User");
const { createUserTable } = require("./models/Staff");
const { createUserTable } = require("./models/Role");

(async () => {
  try {
    await createTable();
    await createUserTable(); // Tạo bảng Users
    console.log("Tất cả các bảng đã được tạo thành công!");
  } catch (err) {
    console.error("Lỗi khi chạy init.js:", err);
  }
})();
