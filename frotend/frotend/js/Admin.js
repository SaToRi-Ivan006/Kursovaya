document.addEventListener('DOMContentLoaded', function() {
    // Проверка авторизации
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }
  
    // Проверка роли
    const userRole = JSON.parse(atob(token.split('.')[1])).role;
    if (userRole !== 'admin') {
      window.location.href = 'index.html';
      return;
    }
  
    // Инициализация табов
    initTabs();
  
    // Загрузка данных
    loadUsers();
    loadGroupsForFilter();
    loadSchedule();
    loadNews();
  
    // Обработчики событий
    document.getElementById('addUserBtn').addEventListener('click', showUserModal);
    document.getElementById('generateScheduleBtn').addEventListener('click', generateSchedule);
    document.getElementById('addNewsBtn').addEventListener('click', showNewsModal);
    document.getElementById('logout').addEventListener('click', logout);
  
    // Модальное окно пользователя
    const userModal = document.getElementById('userModal');
    const userForm = document.getElementById('userForm');
    const closeButtons = document.getElementsByClassName('close');
  
    for (let i = 0; i < closeButtons.length; i++) {
      closeButtons[i].addEventListener('click', function() {
        userModal.style.display = 'none';
        document.getElementById('newsModal').style.display = 'none';
      });
    }
  
    window.addEventListener('click', function(event) {
      if (event.target === userModal) {
        userModal.style.display = 'none';
      }
      if (event.target === document.getElementById('newsModal')) {
        document.getElementById('newsModal').style.display = 'none';
      }
    });
  
    userForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveUser();
    });
  
    document.getElementById('newsForm').addEventListener('submit', function(e) {
      e.preventDefault();
      saveNews();
    });
  
    document.getElementById('groupFilter').addEventListener('change', function() {
      loadSchedule();
    });
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
  
  async function loadUsers() {
    try {
      const response = await fetch('/api/users/students', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Ошибка загрузки пользователей');
      
      const users = await response.json();
      const tbody = document.querySelector('#usersTable tbody');
      tbody.innerHTML = '';
      
      users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${user.user_id}</td>
          <td>${user.username}</td>
          <td>${user.first_name}</td>
          <td>${user.last_name}</td>
          <td>${user.birth_year}</td>
          <td>${user.group_name || '-'}</td>
          <td>${getRoleName(user.role)}</td>
          <td>
            <a href="#" class="action-btn edit-btn" data-id="${user.user_id}">Изменить</a>
            <a href="#" class="action-btn delete-btn" data-id="${user.user_id}">Удалить</a>
          </td>
        `;
        tbody.appendChild(tr);
      });
      
      // Добавляем обработчики для кнопок редактирования и удаления
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          editUser(this.getAttribute('data-id'));
        });
      });
      
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          deleteUser(this.getAttribute('data-id'));
        });
      });
      
    } catch (error) {
      console.error(error);
      alert('Не удалось загрузить пользователей');
    }
  }
  
  function getRoleName(role) {
    const roles = {
      'admin': 'Администратор',
      'teacher': 'Преподаватель',
      'student': 'Студент'
    };
    return roles[role] || role;
  }
  
  function showUserModal(userId = null) {
    const modal = document.getElementById('userModal');
    const form = document.getElementById('userForm');
    const title = document.getElementById('modalTitle');
    
    if (userId) {
      title.textContent = 'Редактировать пользователя';
      fillUserForm(userId);
    } else {
      title.textContent = 'Добавить пользователя';
      form.reset();
      document.getElementById('userId').value = '';
    }
    
    modal.style.display = 'block';
  }
  
  async function fillUserForm(userId) {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Ошибка загрузки данных пользователя');
      
      const user = await response.json();
      
      document.getElementById('userId').value = user.user_id;
      document.getElementById('username').value = user.username;
      document.getElementById('password').value = user.password;
      document.getElementById('firstName').value = user.first_name;
      document.getElementById('lastName').value = user.last_name;
      document.getElementById('birthYear').value = user.birth_year;
      document.getElementById('groupName').value = user.group_name || '';
      document.getElementById('role').value = user.role;
      
    } catch (error) {
      console.error(error);
      alert('Не удалось загрузить данные пользователя');
    }
  }
  
  async function saveUser() {
    const userId = document.getElementById('userId').value;
    const url = userId ? `/api/users/${userId}` : '/api/users';
    const method = userId ? 'PUT' : 'POST';
    
    const userData = {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      birthYear: document.getElementById('birthYear').value,
      groupName: document.getElementById('groupName').value,
      role: document.getElementById('role').value
    };
    
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) throw new Error('Ошибка сохранения пользователя');
      
      const result = await response.json();
      alert('Пользователь успешно сохранён');
      document.getElementById('userModal').style.display = 'none';
      loadUsers();
      
    } catch (error) {
      console.error(error);
      alert('Не удалось сохранить пользователя');
    }
  }
  
  async function editUser(userId) {
    showUserModal(userId);
  }
  
  async function deleteUser(userId) {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Ошибка удаления пользователя');
      
      alert('Пользователь успешно удалён');
      loadUsers();
      
    } catch (error) {
      console.error(error);
      alert('Не удалось удалить пользователя');
    }
  }
  
  async function loadGroupsForFilter() {
    try {
      const response = await fetch('/api/users/groups', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Ошибка загрузки групп');
      
      const groups = await response.json();
      const select = document.getElementById('groupFilter');
      
      groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.group_name;
        option.textContent = group.group_name;
        select.appendChild(option);
      });
      
    } catch (error) {
      console.error(error);
    }
  }
  
  async function loadSchedule() {
    const groupFilter = document.getElementById('groupFilter').value;
    const url = groupFilter === 'all' ? '/api/schedule' : `/api/schedule?group=${groupFilter}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Ошибка загрузки расписания');
      
      const schedule = await response.json();
      renderSchedule(schedule);
      
    } catch (error) {
      console.error(error);
      alert('Не удалось загрузить расписание');
    }
  }
  
  function renderSchedule(schedule) {
    const scheduleGrid = document.querySelector('.schedule-grid');
    scheduleGrid.innerHTML = '';
    
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
          <p>Группа: ${lesson.group_name}</p>
        `;
        dayBlock.appendChild(lessonDiv);
      });
      
      scheduleGrid.appendChild(dayBlock);
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
  
  async function generateSchedule() {
    if (!confirm('Вы уверены, что хотите сгенерировать новое расписание? Текущее расписание будет удалено.')) return;
    
    try {
      const response = await fetch('/api/schedule/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Ошибка генерации расписания');
      
      alert('Расписание успешно сгенерировано');
      loadSchedule();
      
    } catch (error) {
      console.error(error);
      alert('Не удалось сгенерировать расписание');
    }
  }
  
  async function loadNews() {
    try {
      const response = await fetch('/api/news', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Ошибка загрузки новостей');
      
      const news = await response.json();
      renderAdminNews(news);
      
    } catch (error) {
      console.error(error);
      alert('Не удалось загрузить новости');
    }
  }
  
  function renderAdminNews(news) {
    const newsList = document.getElementById('adminNewsList');
    newsList.innerHTML = '';
    
    news.forEach(item => {
      const newsItem = document.createElement('div');
      newsItem.className = 'news-item';
      newsItem.innerHTML = `
        <h3>${item.title}</h3>
        <div class="meta">${new Date(item.created_at).toLocaleString()}</div>
        <p>${item.content}</p>
        <div class="actions">
          <a href="#" class="action-btn edit-btn" data-id="${item.news_id}">Изменить</a>
          <a href="#" class="action-btn delete-btn" data-id="${item.news_id}">Удалить</a>
        </div>
      `;
      newsList.appendChild(newsItem);
    });
    
    // Добавляем обработчики для кнопок редактирования и удаления
    document.querySelectorAll('.news-item .edit-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        editNews(this.getAttribute('data-id'));
      });
    });
    
    document.querySelectorAll('.news-item .delete-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        deleteNews(this.getAttribute('data-id'));
      });
    });
  }
  
  function showNewsModal(newsId = null) {
    const modal = document.getElementById('newsModal');
    const form = document.getElementById('newsForm');
    const title = document.getElementById('newsModalTitle');
    
    if (newsId) {
      title.textContent = 'Редактировать новость';
      fillNewsForm(newsId);
    } else {
      title.textContent = 'Добавить новость';
      form.reset();
      document.getElementById('newsId').value = '';
    }
    
    modal.style.display = 'block';
  }
  
  async function fillNewsForm(newsId) {
    try {
      const response = await fetch(`/api/news/${newsId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Ошибка загрузки новости');
      
      const news = await response.json();
      
      document.getElementById('newsId').value = news.news_id;
      document.getElementById('newsTitle').value = news.title;
      document.getElementById('newsContent').value = news.content;
      
    } catch (error) {
      console.error(error);
      alert('Не удалось загрузить новость');
    }
  }
  
  async function saveNews() {
    const newsId = document.getElementById('newsId').value;
    const url = newsId ? `/api/news/${newsId}` : '/api/news';
    const method = newsId ? 'PUT' : 'POST';
    
    const newsData = {
      title: document.getElementById('newsTitle').value,
      content: document.getElementById('newsContent').value
    };
    
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newsData)
      });
      
      if (!response.ok) throw new Error('Ошибка сохранения новости');
      
      const result = await response.json();
      alert('Новость успешно сохранена');
      document.getElementById('newsModal').style.display = 'none';
      loadNews();
      
    } catch (error) {
      console.error(error);
      alert('Не удалось сохранить новость');
    }
  }
  
  async function editNews(newsId) {
    showNewsModal(newsId);
  }
  
  async function deleteNews(newsId) {
    if (!confirm('Вы уверены, что хотите удалить эту новость?')) return;
    
    try {
      const response = await fetch(`/api/news/${newsId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Ошибка удаления новости');
      
      alert('Новость успешно удалена');
      loadNews();
      
    } catch (error) {
      console.error(error);
      alert('Не удалось удалить новость');
    }
  }
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }