const router = require('express').Router();
const ctrl = require('../controllers/emergencyController');

router.get('/hospitals', ctrl.getNearbyHospitals);
router.get('/nearby-hospitals', ctrl.getNearbyHospitals);
router.get('/contacts', ctrl.getEmergencyContacts);
router.post('/share-location', ctrl.shareLocation);

module.exports = router;
