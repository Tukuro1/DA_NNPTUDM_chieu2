const { createTable } = require("./models/Tables");

(async () => {
  try {
    await createTable();
  } catch (err) {
    console.error("Lỗi khi chạy init.js:", err);
  }
})();
