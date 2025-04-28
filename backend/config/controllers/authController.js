const User = require('../models/User');
const { secret } = require('../config/config');

class AuthController {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findByUsername(username);
      
      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }
      
      // Здесь должна быть проверка пароля (в реальном приложении используйте bcrypt)
      if (user.password !== password) {
        return res.status(400).json({ message: 'Неверный пароль' });
      }
      
      const token = jwt.sign(
        { userId: user.user_id, role: user.role },
        secret,
        { expiresIn: '24h' }
      );
      
      return res.json({ token, role: user.role });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Login error' });
    }
  }
}

module.exports = new AuthController();