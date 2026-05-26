const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/habitController');

router.post('/log', authenticate, ctrl.logHabit);
router.get('/history/:profileId', authenticate, ctrl.getHabitHistory);
router.get('/today/:profileId', authenticate, ctrl.getTodayHabits);

module.exports = router;
