// const express = require('express');
// const bcrypt = require('bcrypt');
// const { sql, poolPromise } = require('./db.js');

// const app = express();
// const PORT = 3000;

// app.use(express.static('public'));
// app.use(express.json());

// // API: Lấy danh sách sách
// app.get('/api/books', async (req, res) => {
//   try {
//     const pool = await poolPromise;
//     const result = await pool.request().query('SELECT * FROM Books');
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('Lỗi truy vấn:', err);
//     res.status(500).json({ message: 'Lỗi truy vấn!' });
//   }
// });

// // API: Đăng ký người dùng mới
// app.post('/api/register', async (req, res) => {
//   const { username, email, password } = req.body;
//   if (!username || !email || !password) {
//     return res.status(400).json({ message: 'Thiếu thông tin' });
//   }

//   try {
//     const pool = await poolPromise;
//     const check = await pool
//       .request()
//       .input('username', sql.VarChar, username)
//       .query('SELECT COUNT(*) AS count FROM users WHERE username = @username');

//     if (check.recordset[0].count > 0) {
//       return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại!' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await pool
//       .request()
//       .input('username', sql.VarChar, username)
//       .input('email', sql.VarChar, email)
//       .input('password', sql.VarChar, hashedPassword)
//       .query('INSERT INTO users (username, email, password) VALUES (@username, @email, @password)');

//     res.json({ message: 'Đăng ký thành công!' });
//   } catch (err) {
//     console.error('Lỗi đăng ký:', err);
//     res.status(500).json({ message: 'Lỗi máy chủ!' });
//   }
// });

// // API: Đăng nhập
// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) {
//     return res.status(400).json({ message: 'Thiếu thông tin đăng nhập' });
//   }

//   try {
//     const pool = await poolPromise;
//     const result = await pool
//       .request()
//       .input('username', sql.VarChar, username)
//       .query('SELECT password FROM users WHERE username = @username');

//     if (result.recordset.length === 0) {
//       return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
//     }

//     const hashedPassword = result.recordset[0].password;
//     const isMatch = await bcrypt.compare(password, hashedPassword);

//     if (isMatch) {
//       res.json({ message: 'Đăng nhập thành công' });
//     } else {
//       res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
//     }
//   } catch (err) {
//     console.error('Lỗi đăng nhập:', err);
//     res.status(500).json({ message: 'Lỗi máy chủ!' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`✅ Server is running at http://localhost:${PORT}`);
// });

// ///// test thử nhé
// const axios = require('axios');

// // API: Tìm sách theo tên (ưu tiên DB, nếu không có thì gọi Google Books API)
// app.get('/api/book', async (req, res) => {
//   const search = req.query.q;
//   if (!search) return res.status(400).json({ message: 'Thiếu từ khóa tìm kiếm' });

//   try {
//     const pool = await poolPromise;

//     // 1. Tìm trong CSDL
//     const result = await pool
//       .request()
//       .input('search', sql.NVarChar, `%${search}%`)
//       .query('SELECT TOP 1 * FROM Books WHERE title LIKE @search');

//     if (result.recordset.length > 0) {
//       return res.json(result.recordset[0]);
//     }

//     // 2. Không có thì tìm từ Google Books
//     const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(search)}&maxResults=1`);
//     const item = response.data.items?.[0]?.volumeInfo;

//     if (!item) return res.status(404).json({ message: 'Không tìm thấy sách từ Google Books' });

//     // 3. Trích dữ liệu
//     const title = item.title;
//     const author = item.authors?.join(', ') || 'Không rõ';
//     const description = item.description || '';
//     const image = item.imageLinks?.thumbnail || '';
//     const category = item.categories?.[0] || 'Khác';
//     const code = 'GBK' + Math.floor(Math.random() * 100000);

//     // 4. Lưu lại vào CSDL
//     await pool.request()
//       .input('title', sql.NVarChar, title)
//       .input('author', sql.NVarChar, author)
//       .input('description', sql.NVarChar(sql.MAX), description)
//       .input('image', sql.VarChar, image)
//       .input('category', sql.NVarChar, category)
//       .input('code', sql.VarChar, code)
//       .query(`
//         INSERT INTO Books (title, author, description, image, category, code)
//         VALUES (@title, @author, @description, @image, @category, @code)
//       `);

//     res.json({ title, author, description, image, category, code });
//   } catch (err) {
//     console.error('Lỗi tìm sách:', err);
//     res.status(500).json({ message: 'Lỗi máy chủ' });
//   }
// });


//tét thử nhé
// server.js
const express = require('express');
const bcrypt = require('bcrypt');
const { sql, poolPromise } = require('./db.js');
const axios = require('axios'); // Thêm axios
require('dotenv').config(); // Thêm để load .env

const app = express();
const PORT = 3000;

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

app.use(express.static('public')); // Giả sử các file html, css, js của bạn nằm trong 'public'
app.use(express.json());

// API: Lấy danh sách sách từ DB hiện tại
app.get('/api/books', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Books'); // Giả sử tên bảng là Books
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi truy vấn sách từ DB:', err);
    res.status(500).json({ message: 'Lỗi truy vấn sách từ DB!' });
  }
});

// API: Lấy chi tiết một cuốn sách từ DB
app.get('/api/books/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        // Chú ý: Kiểu dữ liệu của ID trong DB của bạn là gì? Nếu là INT, cần sql.Int
        // Nếu ID trong DB của bạn là VARCHAR hoặc tương tự, dùng sql.VarChar
        // Giả sử ID trong DB là INT
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM Books WHERE ID = @id'); // Giả sử cột ID tên là 'ID'

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Sách không tồn tại trong DB' });
        }
    } catch (err) {
        console.error('Lỗi truy vấn chi tiết sách DB:', err);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy chi tiết sách DB!' });
    }
});


// === API MỚI CHO GOOGLE BOOKS ===

// API: Tìm kiếm sách trên Google Books
app.get('/api/search-google-books', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ message: 'Thiếu từ khóa tìm kiếm (query parameter "q")' });
    }
    if (!GOOGLE_BOOKS_API_KEY) {
        console.error("GOOGLE_BOOKS_API_KEY chưa được cấu hình!");
        return res.status(500).json({ message: 'Lỗi cấu hình server: API key không tồn tại.' });
    }

    try {
        const googleApiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=20&langRestrict=vi`; // Lấy 20 kết quả, ưu tiên tiếng Việt
        const response = await axios.get(googleApiUrl);

        if (response.data.items && response.data.items.length > 0) {
            const books = response.data.items.map(item => {
                const volumeInfo = item.volumeInfo;
                return {
                    id: item.id, // ID từ Google Books API (chuỗi)
                    title: volumeInfo.title || "Không có tiêu đề",
                    author: volumeInfo.authors ? volumeInfo.authors.join(', ') : "Không rõ tác giả",
                    // Chọn ảnh thumbnail, nếu không có thì smallThumbnail, nếu không có nữa thì ảnh mặc định
                    image: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || 'image/default-book.png',
                    description: volumeInfo.description || "Chưa có mô tả.",
                    publishedDate: volumeInfo.publishedDate,
                    publisher: volumeInfo.publisher,
                    // Thêm các trường khác nếu bạn muốn: categories, pageCount, averageRating, etc.
                };
            });
            res.json(books);
        } else {
            res.json([]); // Trả về mảng rỗng nếu không tìm thấy
        }
    } catch (error) {
        // Log lỗi chi tiết hơn từ Google API nếu có
        if (error.response) {
            console.error('Lỗi từ Google Books API:', error.response.status, error.response.data);
        } else {
            console.error('Lỗi khi gọi Google Books API:', error.message);
        }
        res.status(500).json({ message: 'Lỗi khi tìm kiếm sách từ Google Books API' });
    }
});

// API: Lấy chi tiết một cuốn sách từ Google Books bằng ID của nó
app.get('/api/google-books/:bookId', async (req, res) => {
    const bookId = req.params.bookId;
    if (!GOOGLE_BOOKS_API_KEY) {
        console.error("GOOGLE_BOOKS_API_KEY chưa được cấu hình!");
        return res.status(500).json({ message: 'Lỗi cấu hình server: API key không tồn tại.' });
    }

    try {
        const googleApiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${GOOGLE_BOOKS_API_KEY}`;
        const response = await axios.get(googleApiUrl);

        const volumeInfo = response.data.volumeInfo;
        const bookDetails = {
            id: response.data.id,
            title: volumeInfo.title || "Không có tiêu đề",
            author: volumeInfo.authors ? volumeInfo.authors.join(', ') : "Không rõ tác giả",
            image: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || 'image/default-book.png',
            description: volumeInfo.description || "Chưa có mô tả.",
            publishedDate: volumeInfo.publishedDate,
            publisher: volumeInfo.publisher,
            pageCount: volumeInfo.pageCount,
            categories: volumeInfo.categories ? volumeInfo.categories.join(', ') : "N/A",
            // Thêm các trường khác nếu cần
        };
        res.json(bookDetails);
    } catch (error) {
        if (error.response) {
            console.error('Lỗi chi tiết từ Google Books API:', error.response.status, error.response.data);
            if (error.response.status === 404) {
                 return res.status(404).json({ message: 'Sách không tìm thấy trên Google Books.' });
            }
        } else {
            console.error('Lỗi khi gọi chi tiết sách Google Books API:', error.message);
        }
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết sách từ Google Books API' });
    }
});


// API Đăng ký và Đăng nhập (giữ nguyên)
app.post('/api/register', async (req, res) => { /* ... code của bạn ... */ });
app.post('/api/login', async (req, res) => { /* ... code của bạn ... */ });

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
  if (!GOOGLE_BOOKS_API_KEY) {
    console.warn('⚠️  GOOGLE_BOOKS_API_KEY chưa được thiết lập trong file .env. Chức năng tìm kiếm Google Books sẽ không hoạt động.');
  }
});
