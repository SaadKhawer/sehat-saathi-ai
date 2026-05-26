const grokService = require('../services/grokService');
const { collections } = require('../config/firebase');

exports.checkSymptoms = async (req, res, next) => {
  try {
    const { symptoms, history, language, profileId } = req.body;
    if (!symptoms && (!history || history.length === 0)) {
      return res.status(400).json({ success: false, message: 'Please provide symptoms', messageUrdu: 'براہ کرم علامات بتائیں' });
    }
    const result = await grokService.analyzeSymptoms(symptoms, history || [], language || 'both');
    if (req.user && profileId) {
      try {
        await collections.symptoms.add({
          userId: req.user.uid, profileId,
          symptoms: symptoms || history?.[history.length - 1]?.content,
          aiResponse: result, createdAt: new Date().toISOString(),
        });
      } catch (e) { /* don't fail if save fails */ }
    }
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

exports.getSymptomHistory = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    // No orderBy — avoid composite index
    const snapshot = await collections.symptoms
      .where('userId', '==', req.user.uid)
      .where('profileId', '==', profileId)
      .get();
    const history = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => b.createdAt?.localeCompare(a.createdAt))
      .slice(0, 50);
    res.json({ success: true, data: history });
  } catch (error) { next(error); }
};

exports.followUp = async (req, res, next) => {
  try {
    const { previousSymptoms, daysSince } = req.body;
    const result = await grokService.generateFollowUp(previousSymptoms, daysSince);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};
