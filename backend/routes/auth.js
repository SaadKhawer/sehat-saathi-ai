const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { registerUser, getMe, updateMe } = require('../controllers/authController');

router.post('/register', authenticate, registerUser);
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);

module.exports = router;
