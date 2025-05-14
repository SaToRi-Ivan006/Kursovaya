document.addEventListener('DOMContentLoaded', function() {
    // Загрузка новостей для главной страницы
    function loadNews() {
        // Здесь будет запрос к API для получения новостей
        console.log('Загрузка новостей...');
        
        // Для примера - моковые данные
        const newsData = [
          {
            id: 1,
            title: 'Важное объявление',
            content: 'Завтра собрание в 10:00',
            created_at: new Date()
          },
          {
            id: 2,
            title: 'Изменения в расписании',
            content: 'Пары 3 и 4 поменялись местами',
            created_at: new Date()
          }
        ];
        
        renderNews(newsData);
      }
      
      function renderNews(news) {
        const newsContainer = document.getElementById('news-list') || 
                             document.getElementById('admin-news-list') || 
                             document.getElementById('student-news-list');
        
        if (!newsContainer) return;
        
        newsContainer.innerHTML = news.map(item => `
          <div class="news-item">
            <h3>${item.title}</h3>
            <p class="news-date">${item.created_at.toLocaleDateString()}</p>
            <p>${item.content}</p>
          </div>
        `).join('');
      }
  
    loadNews();
  });