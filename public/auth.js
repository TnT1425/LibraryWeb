document.addEventListener('DOMContentLoaded', function () {
  // Ẩn/hiện các nút theo trạng thái đăng nhập
  function updateAuthUI() {
    const username = localStorage.getItem('username');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    if (username) {
      if (loginLink) loginLink.style.display = 'none';
      if (registerLink) registerLink.style.display = 'none';
      if (userInfo) userInfo.style.display = 'flex';
      if (userName) userName.textContent = username;
    } else {
      if (loginLink) loginLink.style.display = '';
      if (registerLink) registerLink.style.display = '';
      if (userInfo) userInfo.style.display = 'none';
    }
  }

  // Đăng xuất
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.onclick = function () {
      localStorage.removeItem('username');
      updateAuthUI();
      window.location.reload();
    };
  }

  // Gọi hàm cập nhật UI khi load trang
  updateAuthUI();
});