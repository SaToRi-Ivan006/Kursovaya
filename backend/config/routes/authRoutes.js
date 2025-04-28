const Router = require('express');
const authController = require('../controllers/authController');
const { check } = require('express-validator');

const router = new Router();

router.post('/login', 
  [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 4 символов').isLength({ min: 4 })
  ],
  authController.login
);

module.exports = router;