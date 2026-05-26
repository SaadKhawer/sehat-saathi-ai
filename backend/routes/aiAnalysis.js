const router = require('express').Router();
const { optionalAuth } = require('../middleware/auth');
const ctrl = require('../controllers/aiController');

router.post('/disease-probability', optionalAuth, ctrl.diseaseProbability);
router.post('/recovery-prediction', optionalAuth, ctrl.recoveryPrediction);
router.post('/risk-score', optionalAuth, ctrl.riskScore);
router.post('/explain-desi', optionalAuth, ctrl.explainDesi);
router.post('/lab-interpret', optionalAuth, ctrl.labInterpret);
router.post('/daily-tip', optionalAuth, ctrl.dailyTip);
router.post('/diet-suggestion', optionalAuth, ctrl.dietSuggestion);
router.post('/medicine-info', optionalAuth, ctrl.medicineInfo);
router.post('/mental-health', optionalAuth, ctrl.mentalHealthChat);
router.post('/habit-feedback', optionalAuth, ctrl.habitFeedback);

module.exports = router;
