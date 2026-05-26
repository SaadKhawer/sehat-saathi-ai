const admin = require('firebase-admin');

let db = null;
let auth = null;
let collections = {};
let firebaseError = null;

const notReady = () => {
  const error = new Error(
    firebaseError?.message
      ? `Firebase not ready: ${firebaseError.message}`
      : 'Firebase is not configured. Add serviceAccountKey.json in backend/config/'
  );
  error.statusCode = 500;
  throw error;
};

try {
  let serviceAccount;

  // ── Try loading serviceAccountKey.json first ──
  try {
    serviceAccount = require('./serviceAccountKey.json');
    console.log('✅ Firebase: Loaded serviceAccountKey.json');
  } catch (jsonErr) {
    // ── Fallback: use .env variables ──
    console.log('ℹ️  Firebase: serviceAccountKey.json not found, using .env variables');
    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined,
    };
  }

  // ── Normalize: support both snake_case (JSON file) and camelCase (.env) ──
  const projectId   = serviceAccount.project_id   || serviceAccount.projectId;
  const clientEmail = serviceAccount.client_email  || serviceAccount.clientEmail;
  const privateKey  = serviceAccount.private_key   || serviceAccount.privateKey;

  if (!projectId) {
    throw new Error('Firebase project_id is missing from serviceAccountKey.json or .env');
  }
  if (!privateKey) {
    throw new Error('Firebase private_key is missing from serviceAccountKey.json or .env');
  }

  // ── Initialize Firebase Admin ──
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  db   = admin.firestore();
  auth = admin.auth();

  collections = {
    users:               db.collection('users'),
    profiles:            db.collection('profiles'),
    healthRecords:       db.collection('healthRecords'),
    habits:              db.collection('habits'),
    reports:             db.collection('reports'),
    alerts:              db.collection('alerts'),
    medicines:           db.collection('medicines'),
    doctorVerifications: db.collection('doctorVerifications'),
    trendData:           db.collection('trendData'),
    symptoms:            db.collection('symptoms'),
  };

  console.log(`🔥 Firebase connected → Project: ${projectId}`);

} catch (error) {
  firebaseError = error;
  console.error('\n❌ Firebase Error:', error.message);
  console.error('👉 Make sure serviceAccountKey.json is in backend/config/\n');

  // ── Stub out auth & collections so server still starts ──
  auth = { verifyIdToken: notReady };
  collections = new Proxy({}, {
    get() {
      return {
        doc:   notReady,
        add:   notReady,
        set:   notReady,
        get:   notReady,
        update: notReady,
        delete: notReady,
        where: () => ({ orderBy: () => ({ limit: () => ({ get: notReady }), get: notReady }), limit: () => ({ get: notReady }), get: notReady }),
        orderBy: () => ({ limit: () => ({ get: notReady }), get: notReady }),
        limit: () => ({ get: notReady }),
      };
    },
  });
}

module.exports = { admin, db, auth, collections, firebaseError };
