document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
      loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
  
        try {
          // Здесь должен быть реальный запрос к вашему API
          const mockResponse = {
            token: 'mock-token-123',
            role: username === 'admin' ? 'admin' : 'student'
          };
          
          // В реальном коде замените на:
          // const response = await fetch('/api/auth/login', { ... });
          // const data = await response.json();
          
          localStorage.setItem('token', mockResponse.token);
          localStorage.setItem('userRole', mockResponse.role);
          
          if (mockResponse.role === 'admin') {
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'student.html';
          }
        } catch (error) {
          console.error('Login error:', error);
          alert('Ошибка входа. Проверьте данные и попробуйте снова.');
        }
      });
    }
  });