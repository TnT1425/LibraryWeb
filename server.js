const express = require('express');
const app = express();
const PORT = 3000;

const users = require('./users');

// Cho phép phục vụ file tĩnh (frontend)
app.use(express.static(__dirname));
app.use(express.json());

// API mẫu: Lấy danh sách sách
app.get('/api/books', (req, res) => {
  res.json([
    { id: 1, title: "Hãy nhớ tên anh ấy", author: "Trần Hồng Quân" },
    { id: 2, title: "Những chú chim tí hon", author: "Phan Vàng Anh" },
    { id: 3, title: "Nhà Giả Kim", author: "Paulo Coelho" }
  ]);
});

// Đăng ký
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
  }
  users.push({ username, email, password });
  res.json({ message: 'Đăng ký thành công' });
});

// Đăng nhập
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
  }
  res.json({ message: 'Đăng nhập thành công' });
});



app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});