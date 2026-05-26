const { collections } = require('../config/firebase');

exports.getAlerts = async (req, res, next) => {
  try {
    const snapshot = await collections.alerts
      .where('userId', '==', req.user.uid)
      .get();
    const alerts = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => b.createdAt?.localeCompare(a.createdAt))
      .slice(0, 20);
    res.json({ success: true, data: alerts });
  } catch (error) { next(error); }
};

exports.setVaccineReminder = async (req, res, next) => {
  try {
    const { vaccineName, vaccineNameUrdu, dueDate, profileId } = req.body;
    const ref = collections.alerts.doc();
    const data = {
      id: ref.id, userId: req.user.uid, profileId: profileId || '',
      type: 'vaccine', title: `Vaccine: ${vaccineName}`,
      titleUrdu: `ویکسین: ${vaccineNameUrdu || vaccineName}`,
      message: `Due on ${dueDate}`, messageUrdu: `تاریخ: ${dueDate}`,
      severity: 'info', isRead: false, dueDate,
      createdAt: new Date().toISOString(),
    };
    await ref.set(data);
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
};

exports.markRead = async (req, res, next) => {
  try {
    await collections.alerts.doc(req.body.alertId).update({ isRead: true });
    res.json({ success: true });
  } catch (error) { next(error); }
};

exports.getRegionalAlerts = async (req, res, next) => {
  try {
    const snapshot = await collections.alerts
      .where('type', '==', 'regional')
      .get();
    const alerts = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => b.createdAt?.localeCompare(a.createdAt))
      .slice(0, 15);
    res.json({ success: true, data: alerts });
  } catch (error) { next(error); }
};
