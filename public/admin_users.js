async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        // Xử lý và hiển thị danh sách users
    } catch (error) {
        console.error('Lỗi khi tải danh sách người dùng:', error);
    }
}