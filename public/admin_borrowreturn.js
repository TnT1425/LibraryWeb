async function loadBorrows() {
    try {
        const response = await fetch('/api/borrows');
        const borrows = await response.json();
        // Xử lý và hiển thị danh sách mượn/trả
    } catch (error) {
        console.error('Lỗi khi tải danh sách mượn/trả:', error);
    }
}