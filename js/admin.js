document.addEventListener('DOMContentLoaded', function() {
    // Переключение между вкладками
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        // Удаляем активный класс у всех кнопок и вкладок
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Добавляем активный класс текущей кнопке и вкладке
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
  
    // Модальное окно для добавления пользователя
    const userModal = document.getElementById('user-modal');
    document.getElementById('add-user-btn').addEventListener('click', function() {
      userModal.style.display = 'block';
    });
  
    // Модальное окно для добавления новости
    const newsModal = document.getElementById('news-modal');
    document.getElementById('add-news-btn').addEventListener('click', function() {
      newsModal.style.display = 'block';
    });
  
    // Закрытие модальных окон
    document.querySelectorAll('.close').forEach(closeBtn => {
      closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
      });
    });
  
    // Генерация расписания
    document.getElementById('generate-schedule').addEventListener('click', function() {
      alert('Расписание сгенерировано для всех групп');
      // Здесь будет логика генерации расписания
    });
  
    // Выход из системы
    document.getElementById('logout-btn').addEventListener('click', function() {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  
    // Загрузка данных при открытии страницы
    loadUsers();
    loadNews();
  });
  
  // Функция загрузки пользователей
  function loadUsers() {
    // Здесь будет запрос к API для получения списка пользователей
    console.log('Загрузка пользователей...');
  }
  
  // Функция загрузки новостей
  function loadNews() {
    // Здесь будет запрос к API для получения новостей
    console.log('Загрузка новостей...');
  }
  document.addEventListener('DOMContentLoaded', function() {
    // Переход к управлению пользователями
    document.querySelector('[data-tab="users"]').addEventListener('click', function() {
      // Уже реализовано через tab-content
    });
    
    // Переход к расписанию
    document.querySelector('[data-tab="schedule"]').addEventListener('click', function() {
      loadSchedule();
    });
    
    // Переход к новостям
    document.querySelector('[data-tab="news"]').addEventListener('click', function() {
      loadNews();
    });
  });