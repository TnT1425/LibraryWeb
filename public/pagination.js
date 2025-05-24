// /**
//  * Tạo thanh phân trang.
//  * @param {number} totalItems - Tổng số item.
//  * @param {number} itemsPerPage - Số item mỗi trang.
//  * @param {number} currentPage - Trang hiện tại.
//  * @param {function} onPageChange - Callback khi đổi trang.
//  * @param {string} containerId - id của div phân trang.
//  */
// function renderPagination(totalItems, itemsPerPage, currentPage, onPageChange, containerId = 'pagination') {
//   const pagination = document.getElementById(containerId);
//   if (!pagination) return;
//   pagination.innerHTML = '';
//   const totalPages = Math.ceil(totalItems / itemsPerPage);

//   // Nút « (trang trước)
//   const prevBtn = document.createElement('button');
//   prevBtn.textContent = '«';
//   prevBtn.disabled = currentPage === 1;
//   prevBtn.onclick = () => onPageChange(currentPage - 1);
//   pagination.appendChild(prevBtn);

//   // Các nút số trang
//   for (let i = 1; i <= totalPages; i++) {
//     const btn = document.createElement('button');
//     btn.textContent = i;
//     if (i === currentPage) btn.classList.add('active');
//     btn.onclick = () => onPageChange(i);
//     pagination.appendChild(btn);
//   }

//   // Nút » (trang sau)
//   const nextBtn = document.createElement('button');
//   nextBtn.textContent = '»';
//   nextBtn.disabled = currentPage === totalPages || totalPages === 0;
//   nextBtn.onclick = () => onPageChange(currentPage + 1);
//   pagination.appendChild(nextBtn);
// }

function renderPagination(totalItems, itemsPerPage, currentPage, onPageChange, containerId = 'pagination') {
  const pagination = document.getElementById(containerId);
  if (!pagination) return;
  pagination.innerHTML = '';
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Nút « (trang trước)
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '«';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => onPageChange(currentPage - 1);
  pagination.appendChild(prevBtn);

  // Hiển thị trang đầu
  if (totalPages > 1) {
    const firstBtn = document.createElement('button');
    firstBtn.textContent = '1';
    if (currentPage === 1) firstBtn.classList.add('active');
    firstBtn.onclick = () => onPageChange(1);
    pagination.appendChild(firstBtn);
  }

  // Dấu ... nếu cần
  if (currentPage > 4) {
    const dots = document.createElement('span');
    dots.textContent = '...';
    pagination.appendChild(dots);
  }

  // Các nút quanh trang hiện tại
  for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.onclick = () => onPageChange(i);
    pagination.appendChild(btn);
  }

  // Dấu ... nếu cần
  if (currentPage < totalPages - 3) {
    const dots = document.createElement('span');
    dots.textContent = '...';
    pagination.appendChild(dots);
  }

  // Hiển thị trang cuối
  if (totalPages > 1) {
    const lastBtn = document.createElement('button');
    lastBtn.textContent = totalPages;
    if (currentPage === totalPages) lastBtn.classList.add('active');
    lastBtn.onclick = () => onPageChange(totalPages);
    pagination.appendChild(lastBtn);
  }

  // Nút » (trang sau)
  const nextBtn = document.createElement('button');
  nextBtn.textContent = '»';
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;
  nextBtn.onclick = () => onPageChange(currentPage + 1);
  pagination.appendChild(nextBtn);
}