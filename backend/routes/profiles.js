const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/profileController');

router.post('/', authenticate, ctrl.createProfile);
router.get('/', authenticate, ctrl.getProfiles);
router.put('/:id', authenticate, ctrl.updateProfile);
router.delete('/:id', authenticate, ctrl.deleteProfile);

module.exports = router;
