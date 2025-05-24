// Lấy danh sách sách
async function loadBooks() {
    try {
        const response = await fetch('/api/books');
        const books = await response.json();
        const tbody = document.getElementById('booksList');
        tbody.innerHTML = books.map(book => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <img src="${book.image}" alt="${book.title}" class="h-20 w-16 object-cover rounded">
                </td>
                <td class="px-6 py-4">${book.title}</td>
                <td class="px-6 py-4">${book.author}</td>
                <td class="px-6 py-4">${book.category || '-'}</td>
                <td class="px-6 py-4">${book.publishYear || '-'}</td>
                <td class="px-6 py-4">
                    <button onclick="editBook(${book.id})" class="text-blue-600 hover:text-blue-900 mr-3">
                        ✏️ Sửa
                    </button>
                    <button onclick="deleteBook(${book.id})" class="text-red-600 hover:text-red-900">
                        🗑️ Xóa
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Lỗi khi tải danh sách sách:', error);
    }
}

// Mở modal thêm sách
function openAddBookModal() {
    document.getElementById('modalTitle').textContent = 'Thêm sách mới';
    document.getElementById('bookForm').reset();
    document.getElementById('bookId').value = '';
    document.getElementById('bookModal').classList.remove('hidden');
    document.getElementById('bookModal').classList.add('flex');
}

// Đóng modal
function closeModal() {
    document.getElementById('bookModal').classList.add('hidden');
    document.getElementById('bookModal').classList.remove('flex');
}

// Sửa sách
async function editBook(id) {
    try {
        const response = await fetch(`/api/books/${id}`);
        const book = await response.json();
        
        document.getElementById('modalTitle').textContent = 'Sửa sách';
        document.getElementById('bookId').value = book.id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('category').value = book.category || '';
        document.getElementById('publishYear').value = book.publishYear || '';
        document.getElementById('image').value = book.image;
        document.getElementById('description').value = book.description || '';
        
        document.getElementById('bookModal').classList.remove('hidden');
        document.getElementById('bookModal').classList.add('flex');
    } catch (error) {
        console.error('Lỗi khi tải thông tin sách:', error);
    }
}

// Xóa sách
async function deleteBook(id) {
    if (confirm('Bạn có chắc muốn xóa sách này?')) {
        try {
            const response = await fetch(`/api/books/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadBooks(); // Tải lại danh sách
            }
        } catch (error) {
            console.error('Lỗi khi xóa sách:', error);
        }
    }
}

// Xử lý form thêm/sửa sách
document.getElementById('bookForm').onsubmit = async function(e) {
    e.preventDefault();
    
    const bookData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        category: document.getElementById('category').value,
        publishYear: document.getElementById('publishYear').value,
        image: document.getElementById('image').value,
        description: document.getElementById('description').value
    };
    
    const bookId = document.getElementById('bookId').value;
    const method = bookId ? 'PUT' : 'POST';
    const url = bookId ? `/api/books/${bookId}` : '/api/books';
    
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });
        
        if (response.ok) {
            closeModal();
            loadBooks(); // Tải lại danh sách
        }
    } catch (error) {
        console.error('Lỗi khi lưu sách:', error);
    }
};

// Tải danh sách sách khi trang được load
document.addEventListener('DOMContentLoaded', loadBooks);