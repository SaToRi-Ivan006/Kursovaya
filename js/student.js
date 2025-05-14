document.addEventListener('DOMContentLoaded', function() {
    // Переключение между вкладками
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
  
    // Открытие/закрытие уведомлений
    const notificationBell = document.querySelector('.notification-bell');
    const notificationsPanel = document.querySelector('.notifications-panel');
    
    notificationBell.addEventListener('click', function() {
      notificationsPanel.style.display = notificationsPanel.style.display === 'block' ? 'none' : 'block';
    });
  
    // Выход из системы
    document.getElementById('logout-btn').addEventListener('click', function() {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  
    // Загрузка данных студента
    loadStudentData();
    loadSchedule();
    loadNews();
  });
  
  function loadStudentData() {
    // Загрузка данных студента с сервера
  }
  
  function loadSchedule() {
    // Загрузка расписания
  }
  
  function loadNews() {
    // Загрузка новостей
  }
  document.addEventListener('DOMContentLoaded', function() {
    // Переход к профилю
    document.querySelector('[data-tab="profile"]').addEventListener('click', function() {
      loadProfile();
    });
    
    // Переход к расписанию
    document.querySelector('[data-tab="schedule"]').addEventListener('click', function() {
      loadStudentSchedule();
    });
    
    // Переход к новостям
    document.querySelector('[data-tab="news"]').addEventListener('click', function() {
      loadStudentNews();
    });
  });