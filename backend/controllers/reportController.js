const grokService = require('../services/grokService');
const pdfService = require('../services/pdfService');
const { collections } = require('../config/firebase');

exports.generateReport = async (req, res, next) => {
  try {
    const { profileId, symptoms, healthRecords } = req.body;
    let profileData = {};
    if (profileId) {
      try {
        const profileDoc = await collections.profiles.doc(profileId).get();
        if (profileDoc.exists) profileData = profileDoc.data();
      } catch (e) {}
    }
    const report = await grokService.generateReport(profileData, symptoms || '', healthRecords || []);
    let reportData = {
      userId: req.user.uid, profileId: profileId || null,
      type: 'ai-health-report', content: report, createdAt: new Date().toISOString(),
    };
    try {
      const reportRef = collections.reports.doc();
      reportData.id = reportRef.id;
      await reportRef.set(reportData);
    } catch (e) { reportData.id = 'local-' + Date.now(); }
    res.json({ success: true, message: 'Report generated', messageUrdu: 'رپورٹ بن گئی', data: reportData });
  } catch (error) { next(error); }
};

exports.downloadReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await collections.reports.doc(id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Report not found' });
    const reportData = doc.data();
    const pdfBuffer = await pdfService.generateHealthReport(reportData.content);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=sehat-saathi-report-${id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) { next(error); }
};

exports.listReports = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    // No orderBy — sort client-side
    const snapshot = await collections.reports
      .where('userId', '==', req.user.uid)
      .where('profileId', '==', profileId)
      .get();
    const reports = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => b.createdAt?.localeCompare(a.createdAt))
      .slice(0, 20);
    res.json({ success: true, data: reports });
  } catch (error) { next(error); }
};

exports.listAllReports = async (req, res, next) => {
  try {
    const snapshot = await collections.reports
      .where('userId', '==', req.user.uid)
      .get();
    const reports = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => b.createdAt?.localeCompare(a.createdAt))
      .slice(0, 20);
    res.json({ success: true, data: reports });
  } catch (error) { next(error); }
};
