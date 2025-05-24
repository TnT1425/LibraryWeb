document.addEventListener('DOMContentLoaded', function () {
    const booksPerPage = 8;
    let currentPage = 1;
    let books = []; // This will hold the books from the API

    // Quan trọng: Kiểm tra xem renderPagination có tồn tại không
    console.log('book.js: DOMContentLoaded. typeof window.renderPagination:', typeof window.renderPagination);

    function renderBooks(page) {
        const container = document.getElementById('book-list');
        if (!container) {
            console.error("Phần tử với id 'book-list' không tìm thấy.");
            return;
        }
        container.innerHTML = ''; // Xóa sách cũ
        const start = (page - 1) * booksPerPage;
        const end = start + booksPerPage;
        const paginatedBooks = books.slice(start, end);

        if (paginatedBooks.length === 0 && books.length > 0) {
            // Trường hợp này không nên xảy ra nếu logic phân trang đúng
            // và trang hiện tại hợp lệ
            container.innerHTML = "<p>Không có sách để hiển thị ở trang này.</p>";
            return;
        }
         // Nếu books vẫn rỗng (API trả về rỗng hoặc lỗi fetch trước đó)
        if (books.length === 0) {
            // Thông báo lỗi đã được xử lý ở catch của fetch,
            // hoặc sẽ có thông báo "Không có sách nào" nếu API trả về mảng rỗng.
            return;
        }

        paginatedBooks.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.setAttribute('data-id', book.id);
            card.innerHTML = `
                <img src="${book.image}" alt="${book.title}" class="book-img" />
                <h3>${book.title}</h3>
                <p>Tác giả: ${book.author}</p>
            `;
            card.onclick = function() {
                window.location.href = `bookdetail.html?id=${book.id}`;
            };
            container.appendChild(card);
        });
    }

    // Định nghĩa hàm callback cho việc thay đổi trang MỘT LẦN
    function handlePageChange(newPage) {
        currentPage = newPage;
        renderBooks(currentPage);
        // Gọi lại hàm renderPagination toàn cục để cập nhật UI phân trang
        if (typeof window.renderPagination === 'function') {
            window.renderPagination(
                books.length,
                booksPerPage,
                currentPage,
                handlePageChange, // Truyền chính hàm này làm callback
                'pagination'      // ID của container phân trang
            );
        } else {
            console.error("Lỗi: window.renderPagination không phải là một hàm khi đổi trang.");
        }
    }

    // Gọi API và hiển thị sách + phân trang
    fetch('/api/books')
        .then(res => {
            if (!res.ok) { // Kiểm tra nếu fetch không thành công (vd: 404, 500)
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log('book.js: Dữ liệu sách nhận được từ API:', data); // LOG QUAN TRỌNG
            if (Array.isArray(data)) {
                books = data; // Gán dữ liệu sách
                if (books.length > 0) {
                    renderBooks(currentPage); // Hiển thị trang sách đầu tiên
                    // Gọi hàm renderPagination toàn cục LẦN ĐẦU
                    if (typeof window.renderPagination === 'function') {
                        window.renderPagination(
                            books.length,
                            booksPerPage,
                            currentPage,
                            handlePageChange, // Truyền hàm callback đã định nghĩa
                            'pagination'      // ID của container phân trang
                        );
                    } else {
                         console.error("Lỗi: window.renderPagination không phải là một hàm khi khởi tạo phân trang.");
                         document.getElementById('pagination').innerHTML = "<p style='color:red'>Lỗi khởi tạo phân trang.</p>";
                    }
                } else {
                    document.getElementById('book-list').innerHTML = '<p>Hiện tại không có sách nào.</p>';
                    const paginationContainer = document.getElementById('pagination');
                    if (paginationContainer) paginationContainer.innerHTML = ''; // Xóa phân trang nếu không có sách
                }
            } else {
                console.error('book.js: Dữ liệu trả về từ API không phải là một mảng:', data);
                document.getElementById('book-list').innerHTML = '<p style="color:red">Lỗi: Dữ liệu sách không hợp lệ.</p>';
            }
        })
        .catch(err => {
            document.getElementById('book-list').innerHTML = `<p style="color:red">Không lấy được dữ liệu sách! (${err.message})</p>`;
            const paginationContainer = document.getElementById('pagination');
            if (paginationContainer) paginationContainer.innerHTML = ''; // Xóa phân trang nếu lỗi
            console.error('book.js: Lỗi khi fetch sách:', err);
        });

    // Gợi ý tìm kiếm
    const searchInput = document.getElementById('dbSearchInput');
    const searchBtn = document.getElementById('dbSearchButton');
    const suggestionBox = document.createElement('div');
    suggestionBox.className = 'suggestion-box';
    suggestionBox.style.position = 'absolute';
    suggestionBox.style.background = '#fff';
    suggestionBox.style.border = '1px solid #ccc';
    suggestionBox.style.zIndex = 1000;
    suggestionBox.style.width = searchInput.offsetWidth + 'px';
    suggestionBox.style.display = 'none';
    searchInput.parentNode.appendChild(suggestionBox);

    searchInput.addEventListener('input', function () {
        const keyword = searchInput.value.trim().toLowerCase();
        suggestionBox.innerHTML = '';
        if (!keyword || books.length === 0) {
            suggestionBox.style.display = 'none';
            return;
        }

        // Tìm kiếm trong tất cả thông tin của sách
        const suggestions = books.filter(book => {
            return (
                // Tìm trong tiêu đề
                (book.title && book.title.toLowerCase().includes(keyword)) ||
                // Tìm trong tác giả
                (book.author && book.author.toLowerCase().includes(keyword)) ||
                // Tìm trong mô tả
                //  (book.description && book.description.toLowerCase().includes(keyword)) ||
                // Tìm trong thể loại
                (book.category && book.category.toLowerCase().includes(keyword)) ||
                // Tìm trong năm xuất bản
                (book.publishYear && book.publishYear.toString().includes(keyword)) ||
                // Tìm trong nhà xuất bản
                (book.publisher && book.publisher.toLowerCase().includes(keyword))
            );
        }).slice(0, 7);

        if (suggestions.length === 0) {
            suggestionBox.style.display = 'none';
            return;
        }

        suggestions.forEach(book => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';

            // Hiển thị thông tin chi tiết hơn trong gợi ý
            let matchingInfo = '';
            if (book.title.toLowerCase().includes(keyword)) {
                matchingInfo = `<div class="suggestion-title">${highlightText(book.title, keyword)}</div>`;
            } else if (book.author.toLowerCase().includes(keyword)) {
                matchingInfo = `<div class="suggestion-author">Tác giả: ${highlightText(book.author, keyword)}</div>`;
            } else if (book.description && book.description.toLowerCase().includes(keyword)) {
                const shortDesc = book.description.substring(0, 100) + '...';
                matchingInfo = `<div class="suggestion-desc">Mô tả: ${highlightText(shortDesc, keyword)}</div>`;
            }

            item.innerHTML = `
                <div class="suggestion-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path d="M7 9H2V7h5v2zm0 3H2v2h5v-2zm13.59 7-3.83-3.83C15.96 16.35 15.02 17 14 17c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4c0 1.02-.65 1.96-1.17 2.76l3.83 3.83L19.59 19zM14 15c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
                              fill="#9aa0a6"/>
                    </svg>
                </div>
                <div class="suggestion-content">
                    <div class="suggestion-title">${highlightText(book.title, keyword)}</div>
                    <div class="suggestion-author">${book.author}</div>
                    ${matchingInfo}
                </div>
            `;

            item.onmousedown = function() {
                searchInput.value = book.title;
                suggestionBox.style.display = 'none';
                doSearch();
            };

            suggestionBox.appendChild(item);
        });
    });

    searchInput.addEventListener('blur', function () {
        setTimeout(() => suggestionBox.style.display = 'none', 150);
    });

    // Chức năng tìm kiếm sách
    function doSearch() {
        const keyword = searchInput.value.trim().toLowerCase();
        if (!keyword) {
            renderBooks(1);
            if (typeof window.renderPagination === 'function') {
                window.renderPagination(
                    books.length,
                    booksPerPage,
                    1,
                    handlePageChange,
                    'pagination'
                );
            }
            return;
        }
        const filteredBooks = books.filter(book => {
            return (
                (book.title && book.title.toLowerCase().includes(keyword)) ||
                (book.author && book.author.toLowerCase().includes(keyword)) ||
                (book.description && book.description.toLowerCase().includes(keyword)) ||
                (book.category && book.category.toLowerCase().includes(keyword)) ||
                (book.publishYear && book.publishYear.toString().includes(keyword)) ||
                (book.publisher && book.publisher.toLowerCase().includes(keyword))
            );
        });
        function renderFiltered(page) {
            const container = document.getElementById('book-list');
            container.innerHTML = '';
            const start = (page - 1) * booksPerPage;
            const end = start + booksPerPage;
            const paginated = filteredBooks.slice(start, end);
            if (paginated.length === 0) {
                container.innerHTML = "<p>Không tìm thấy sách phù hợp.</p>";
                document.getElementById('pagination').innerHTML = '';
                return;
            }
            paginated.forEach(book => {
                const card = document.createElement('div');
                card.className = 'book-card';
                card.setAttribute('data-id', book.id);
                card.innerHTML = `
                    <img src="${book.image}" alt="${book.title}" class="book-img" />
                    <h3>${book.title}</h3>
                    <p>Tác giả: ${book.author}</p>
                `;
                card.onclick = function() {
                    window.location.href = `bookdetail.html?id=${book.id}`;
                };
                container.appendChild(card);
            });
        }
        function handleFilteredPage(page) {
            renderFiltered(page);
            if (typeof window.renderPagination === 'function') {
                window.renderPagination(
                    filteredBooks.length,
                    booksPerPage,
                    page,
                    handleFilteredPage,
                    'pagination'
                );
            }
        }
        handleFilteredPage(1);
    }

    if (searchBtn) {
        searchBtn.onclick = doSearch;
    }
    if (searchInput) {
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') doSearch();
        });
    }

    // Hàm highlight từ khóa tìm kiếm
    function highlightText(text, keyword) {
        if (!text) return '';
        const regex = new RegExp(`(${keyword})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }
});
