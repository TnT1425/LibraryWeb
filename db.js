// db.js
const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'MatKhauMoi123!',
  server: 'localhost',
  database: 'QLTV',
  options: {
    trustServerCertificate: true,
    encrypt: false // Không mã hóa, tùy theo cấu hình SQL của bạn
  }
};

// Tạo pool kết nối một lần và tái sử dụng
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Đã kết nối đến SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('❌ Kết nối SQL thất bại:', err);
    throw err;
  });

// Xuất ra để dùng trong các file khác
module.exports = {
  sql,
  poolPromise
};
