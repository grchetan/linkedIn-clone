const express = require('express');
const { signup, login } = require('../controllers/authController');
const { authenticate, logout } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticate, logout);

module.exports = router;
