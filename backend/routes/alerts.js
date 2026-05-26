const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/alertController');

router.get('/', authenticate, ctrl.getAlerts);
router.post('/vaccine-reminder', authenticate, ctrl.setVaccineReminder);
router.post('/mark-read', authenticate, ctrl.markRead);
router.get('/regional', ctrl.getRegionalAlerts);

module.exports = router;
