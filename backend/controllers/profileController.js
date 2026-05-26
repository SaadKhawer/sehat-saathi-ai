const { collections } = require('../config/firebase');

exports.createProfile = async (req, res, next) => {
  try {
    const { name, relation, age, gender, bloodGroup, allergies, conditions, medications } = req.body;
    if (!name || !relation) {
      return res.status(400).json({ success: false, message: 'Name and relation required' });
    }
    const ref = collections.profiles.doc();
    const profileData = {
      id: ref.id, userId: req.user.uid, name, relation,
      age: age || null, gender: gender || '', bloodGroup: bloodGroup || '',
      allergies: allergies || [], conditions: conditions || [], medications: medications || [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    await ref.set(profileData);
    res.status(201).json({ success: true, message: 'Profile created', messageUrdu: 'پروفائل بن گیا', data: profileData });
  } catch (error) { next(error); }
};

exports.getProfiles = async (req, res, next) => {
  try {
    // No orderBy — avoids composite index requirement
    const snapshot = await collections.profiles
      .where('userId', '==', req.user.uid)
      .get();
    const profiles = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => a.createdAt?.localeCompare(b.createdAt));   // sort client-side
    res.json({ success: true, data: profiles });
  } catch (error) { next(error); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    delete updates.userId;
    delete updates.id;
    await collections.profiles.doc(id).update(updates);
    res.json({ success: true, message: 'Profile updated', messageUrdu: 'پروفائل اپ ڈیٹ ہو گیا' });
  } catch (error) { next(error); }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await collections.profiles.doc(id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Profile not found' });
    if (doc.data().relation === 'self') return res.status(400).json({ success: false, message: 'Cannot delete self profile' });
    await collections.profiles.doc(id).delete();
    res.json({ success: true, message: 'Profile deleted', messageUrdu: 'پروفائل حذف ہو گیا' });
  } catch (error) { next(error); }
};
