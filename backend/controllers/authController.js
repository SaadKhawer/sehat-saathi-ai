const { collections } = require('../config/firebase');

// POST /api/auth/register - Save user profile after Firebase Auth signup
exports.registerUser = async (req, res, next) => {
  try {
    const { uid, email, name } = req.user;
    const { phone, city, language, age, gender } = req.body;

    const userData = {
      uid,
      email,
      name: name || req.body.name || '',
      phone: phone || '',
      city: city || '',
      language: language || 'both',
      age: age || null,
      gender: gender || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await collections.users.doc(uid).set(userData, { merge: true });

    // Create default "self" profile
    const profileRef = collections.profiles.doc();
    await profileRef.set({
      id: profileRef.id,
      userId: uid,
      name: userData.name,
      relation: 'self',
      age: userData.age,
      gender: userData.gender,
      bloodGroup: '',
      allergies: [],
      conditions: [],
      medications: [],
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      messageUrdu: 'اکاؤنٹ کامیابی سے بن گیا',
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me - Get current user
exports.getMe = async (req, res, next) => {
  try {
    const doc = await collections.users.doc(req.user.uid).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: doc.data() });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/me - Update user profile
exports.updateMe = async (req, res, next) => {
  try {
    const { name, phone, city, language, age, gender } = req.body;
    const updates = { updatedAt: new Date().toISOString() };
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (city !== undefined) updates.city = city;
    if (language !== undefined) updates.language = language;
    if (age !== undefined) updates.age = age;
    if (gender !== undefined) updates.gender = gender;

    await collections.users.doc(req.user.uid).update(updates);

    res.json({
      success: true,
      message: 'Profile updated',
      messageUrdu: 'پروفائل اپ ڈیٹ ہو گیا',
    });
  } catch (error) {
    next(error);
  }
};
