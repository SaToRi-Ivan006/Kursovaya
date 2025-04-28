document.addEventListener('DOMContentLoaded', function() {
    // Проверка авторизации
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }
  
    // Проверка роли
    const userData = JSON.parse(atob(token.split('.')[1]));
    if (userData.role !== 'student') {
      window.location.href = 'index.html';
      return;
    }
  
    // Инициализация табов
    initTabs();
  
    // Загрузка данных
    loadProfile(userData.userId);
    loadStudentSchedule(userData.userId);
    loadStudentNews();
    loadNotifications(userData.userId);
  
    // Обработчики событий
    document.getElementById('logout').addEventListener('click', logout);
    document.getElementById('notificationBell').addEventListener('click', toggleNotificationsPanel);
  });
  
  function initTabs() {
    const tabs = document.querySelectorAll('nav ul li a');
    tabs.forEach(tab => {
      tab.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Удаляем активный класс у всех табов и контента
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        // Добавляем активный класс текущему табу и контенту
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
  }
  
  async function loadProfile(userId) {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Ошибка загрузки профиля');
      
      const user = await response.json();
      
      document.getElementById('studentFirstName').textContent = user.first_name;
      document.getElementById('studentLastName').textContent = user.last_name;
      document.getElementById('studentBirthYear').textContent = user.birth_year;
      document.getElementById('studentGroup').textContent = user.group_name || '-';
      
    } catch (error) {
      console.error(error);
      alert('Не удалось загрузить профиль');
    }
  }
  
  async function loadStudentSchedule(userId) {
    try {
      // Сначала получаем данные студента, чтобы узнать его группу
      const userResponse = await fetch(`/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!userResponse.ok) throw new Error('Ошибка загрузки данных студента');
      
      const user = await userResponse.json();
      if (!user.group_name) {
        document.querySelector('#schedule').innerHTML = '<p>Вы не привязаны к группе</p>';
        return;
      }
      
      // Затем загружаем расписание для группы
      const scheduleResponse = await fetch(`/api/schedule?group=${user.group_name}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!scheduleResponse.ok) throw new Error('Ошибка загрузки расписания');
      
      const schedule = await scheduleResponse.json();
      renderStudentSchedule(schedule);
      
    } catch (error) {
      console.error(error);
      document.querySelector('#schedule').innerHTML = '<p>Не удалось загрузить расписание</p>';
    }
  }
  
  function renderStudentSchedule(schedule) {
    const scheduleWeek = document.querySelector('.schedule-week');
    scheduleWeek.innerHTML = '';
    
    // Группируем по дням недели
    const days = {};
    schedule.forEach(item => {
      if (!days[item.day_of_week]) {
        days[item.day_of_week] = [];
      }
      days[item.day_of_week].push(item);
    });
    
    // Сортируем дни недели
    const sortedDays = Object.keys(days).sort().map(day => parseInt(day));
    
    // Создаем блоки для каждого дня
    sortedDays.forEach(day => {
      const dayBlock = document.createElement('div');
      dayBlock.className = 'schedule-day';
      
      const dayName = getDayName(day);
      dayBlock.innerHTML = `<h3>${dayName}</h3>`;
      
      // Сортируем занятия по номеру урока
      days[day].sort((a, b) => a.lesson_number - b.lesson_number);
      
      // Добавляем занятия
      days[day].forEach(lesson => {
        const lessonDiv = document.createElement('div');
        lessonDiv.className = 'lesson';
        lessonDiv.innerHTML = `
          <p><strong>${lesson.lesson_number} урок</strong></p>
          <p>${lesson.subject_name}</p>
          <p>Аудитория: ${lesson.classroom}</p>
          <p>Преподаватель: ${lesson.teacher_name || '-'}</p>
        `;
        dayBlock.appendChild(lessonDiv);
      });
      
      scheduleWeek.appendChild(dayBlock);
    });
  }
  
  function getDayName(dayNumber) {
    const days = [
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
      'Воскресенье'
    ];
    return days[dayNumber - 1] || `День ${dayNumber}`;
  }
  
  async function loadStudentNews() {
    try {
      const response = await fetch('/api/news', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Ошибка загрузки новостей');
      
      const news = await response.json();
      renderStudentNews(news);
      
    } catch (error) {
      console.error(error);
      document.getElementById('studentNewsList').innerHTML = '<p>Не удалось загрузить новости</p>';
    }
  }
  
  function renderStudentNews(news) {
    const newsList = document.getElementById('studentNewsList');
    newsList.innerHTML = '';
    
    news.forEach(item => {
      const newsItem = document.createElement('div');
      newsItem.className = 'news-item';
      newsItem.innerHTML = `
        <h3>${item.title}</h3>
        <div class="meta">${new Date(item.created_at).toLocaleString()}</div>
        <p>${item.content}</p>
      `;
      newsList.appendChild(newsItem);
    });
  }
  
  async function loadNotifications(userId) {
    try {
      const response = await fetch(`/api/notifications?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Ошибка загрузки уведомлений');
      
      const notifications = await response.json();
      renderNotifications(notifications);
      
      // Обновляем счетчик непрочитанных
      const unreadCount = notifications.filter(n => !n.is_read).length;
      document.getElementById('notificationCount').textContent = unreadCount;
      
    } catch (error) {
      console.error(error);
    }
  }
  
  function renderNotifications(notifications) {
    const notificationsList = document.getElementById('notificationsList');
    notificationsList.innerHTML = '';
    
    notifications.forEach(notification => {
      const notificationItem = document.createElement('div');
      notificationItem.className = `notification-item ${notification.is_read ? '' : 'unread'}`;
      notificationItem.innerHTML = `
        <p>${notification.message}</p>
        <small>${new Date(notification.created_at).toLocaleString()}</small>
      `;
      
      // Помечаем как прочитанное при клике
      if (!notification.is_read) {
        notificationItem.addEventListener('click', () => {
          markNotificationAsRead(notification.notification_id);
        });
      }
      
      notificationsList.appendChild(notificationItem);
    });
  }
  
  async function markNotificationAsRead(notificationId) {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Ошибка обновления уведомления');
      
      // Перезагружаем уведомления
      const userData = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
      loadNotifications(userData.userId);
      
    } catch (error) {
      console.error(error);
    }
  }
  
  function toggleNotificationsPanel() {
    const panel = document.getElementById('notificationsPanel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    
    // Если панель открывается, помечаем все уведомления как прочитанные
    if (panel.style.display === 'block') {
      const userData = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
      markAllNotificationsAsRead(userData.userId);
    }
  }
  
  async function markAllNotificationsAsRead(userId) {
    try {
      const response = await fetch(`/api/notifications/mark-all-read?userId=${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Ошибка обновления уведомлений');
      
      // Обновляем счетчик
      document.getElementById('notificationCount').textContent = '0';
      
    } catch (error) {
      console.error(error);
    }
  }
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }