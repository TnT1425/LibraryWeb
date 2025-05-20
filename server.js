const express = require('express');
const bcrypt = require('bcrypt');
const { sql, poolPromise } = require('./db.js');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// API: Lấy danh sách sách
app.get('/api/books', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Books');
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi truy vấn:', err);
    res.status(500).json({ message: 'Lỗi truy vấn!' });
  }
});

// API: Đăng ký người dùng mới
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Thiếu thông tin' });
  }

  try {
    const pool = await poolPromise;
    const check = await pool
      .request()
      .input('username', sql.VarChar, username)
      .query('SELECT COUNT(*) AS count FROM users WHERE username = @username');

    if (check.recordset[0].count > 0) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool
      .request()
      .input('username', sql.VarChar, username)
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, hashedPassword)
      .query('INSERT INTO users (username, email, password) VALUES (@username, @email, @password)');

    res.json({ message: 'Đăng ký thành công!' });
  } catch (err) {
    console.error('Lỗi đăng ký:', err);
    res.status(500).json({ message: 'Lỗi máy chủ!' });
  }
});

// API: Đăng nhập
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Thiếu thông tin đăng nhập' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('username', sql.VarChar, username)
      .query('SELECT password FROM users WHERE username = @username');

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }

    const hashedPassword = result.recordset[0].password;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (isMatch) {
      res.json({ message: 'Đăng nhập thành công' });
    } else {
      res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    res.status(500).json({ message: 'Lỗi máy chủ!' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
