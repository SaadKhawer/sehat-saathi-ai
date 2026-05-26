const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/reportController');

router.post('/generate', authenticate, ctrl.generateReport);
router.get('/download/:id', authenticate, ctrl.downloadReport);
router.get('/list/:profileId', authenticate, ctrl.listReports);
router.get('/all', authenticate, ctrl.listAllReports);

module.exports = router;
