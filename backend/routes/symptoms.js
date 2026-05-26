const router = require('express').Router();
const { authenticate, optionalAuth } = require('../middleware/auth');
const ctrl = require('../controllers/symptomController');

router.post('/check', optionalAuth, ctrl.checkSymptoms);
router.get('/history/:profileId', authenticate, ctrl.getSymptomHistory);
router.post('/follow-up', optionalAuth, ctrl.followUp);

module.exports = router;
