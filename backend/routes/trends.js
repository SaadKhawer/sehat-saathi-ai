const router = require('express').Router();
const ctrl = require('../controllers/trendController');

router.get('/regional', ctrl.getRegionalTrends);
router.get('/seasonal', ctrl.getSeasonalTrends);

module.exports = router;
