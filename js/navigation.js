// Проверка авторизации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Если пользователь не авторизован, перенаправляем на login.html
    if (!token && currentPage !== 'login.html' && currentPage !== 'index.html') {
      window.location.href = 'login.html';
      return;
    }
    
    // Если пользователь авторизован, но пытается зайти на login.html
    if (token && currentPage === 'login.html') {
      redirectByRole();
    }
  });
  
  // Перенаправление по роли
  function redirectByRole() {
    const role = localStorage.getItem('userRole');
    if (role === 'admin') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'student.html';
    }
  }
  
  // Выход из системы
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = 'login.html';
  }
  
  // Добавляем обработчики для всех кнопок выхода
  document.addEventListener('DOMContentLoaded', function() {
    const logoutButtons = document.querySelectorAll('.logout-btn, #logout-btn');
    logoutButtons.forEach(btn => {
      btn.addEventListener('click', logout);
    });
  });