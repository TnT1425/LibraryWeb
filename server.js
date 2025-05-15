const express = require('express');
const app = express();
const PORT = 3000;

// Cho phép phục vụ file tĩnh (frontend)
app.use(express.static(__dirname));

// API mẫu: Lấy danh sách sách
app.get('/api/books', (req, res) => {
  res.json([
    { id: 1, title: "Hãy nhớ tên anh ấy", author: "Trần Hồng Quân" },
    { id: 2, title: "Những chú chim tí hon", author: "Phan Vàng Anh" },
    { id: 3, title: "Nhà Giả Kim", author: "Paulo Coelho" }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});