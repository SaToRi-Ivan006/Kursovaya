// Функция для загрузки новостей
async function loadNews() {
    try {
      const response = await fetch('/api/news/latest');
      if (!response.ok) throw new Error('Ошибка загрузки новостей');
      
      const news = await response.json();
      renderNews(news);
    } catch (error) {
      console.error('Ошибка:', error);
      renderNewsError();
    }
  }
  
  // Функция для отображения новостей
  function renderNews(news) {
    const newsList = document.getElementById('newsList');
    newsList.innerHTML = '';
    
    if (news.length === 0) {
      newsList.innerHTML = `
        <div class="news-item">
          <h3>Новостей пока нет</h3>
          <p>Следите за обновлениями</p>
        </div>
      `;
      return;
    }
    
    news.forEach(item => {
      const newsItem = document.createElement('div');
      newsItem.className = 'news-item';
      newsItem.innerHTML = `
        <h3>${item.title}</h3>
        <div class="meta">${new Date(item.created_at).toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</div>
        <p>${item.content.substring(0, 150)}${item.content.length > 150 ? '...' : ''}</p>
      `;
      newsList.appendChild(newsItem);
    });
  }
  
  // Функция для отображения ошибки загрузки новостей
  function renderNewsError() {
    const newsList = document.getElementById('newsList');
    newsList.innerHTML = `
      <div class="news-item error">
        <h3>Ошибка загрузки новостей</h3>
        <p>Попробуйте обновить страницу позже</p>
      </div>
    `;
  }
  
  // Загружаем новости при загрузке страницы
  document.addEventListener('DOMContentLoaded', loadNews);