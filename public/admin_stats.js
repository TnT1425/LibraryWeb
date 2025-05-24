async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();
        // Xử lý và hiển thị thống kê
    } catch (error) {
        console.error('Lỗi khi tải thống kê:', error);
    }
}