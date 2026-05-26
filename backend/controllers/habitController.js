const { collections } = require('../config/firebase');

exports.logHabit = async (req, res, next) => {
  try {
    const { profileId, water, sleep, activity, mood, notes } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const habitData = {
      userId: req.user.uid, profileId: profileId || 'default', date: today,
      water: water || 0, sleep: sleep || 0, activity: activity || 0,
      mood: mood || '', notes: notes || '',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    // Check if today's entry exists — no orderBy needed
    const existing = await collections.habits
      .where('userId', '==', req.user.uid)
      .where('profileId', '==', habitData.profileId)
      .where('date', '==', today)
      .get();

    if (!existing.empty) {
      const docId = existing.docs[0].id;
      await collections.habits.doc(docId).update({ ...habitData, updatedAt: new Date().toISOString() });
      res.json({ success: true, message: 'Habit updated', data: { id: docId, ...habitData } });
    } else {
      const ref = collections.habits.doc();
      habitData.id = ref.id;
      await ref.set(habitData);
      res.status(201).json({ success: true, message: 'Habit logged', data: habitData });
    }
  } catch (error) { next(error); }
};

exports.getHabitHistory = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const days = parseInt(req.query.days) || 30;
    // No orderBy — sort client-side
    const snapshot = await collections.habits
      .where('userId', '==', req.user.uid)
      .where('profileId', '==', profileId)
      .get();
    const habits = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => b.date?.localeCompare(a.date))
      .slice(0, days);
    res.json({ success: true, data: habits });
  } catch (error) { next(error); }
};

exports.getTodayHabits = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const today = new Date().toISOString().split('T')[0];
    const snapshot = await collections.habits
      .where('userId', '==', req.user.uid)
      .where('profileId', '==', profileId)
      .where('date', '==', today)
      .get();
    if (snapshot.empty) return res.json({ success: true, data: null });
    const doc = snapshot.docs[0];
    res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) { next(error); }
};
