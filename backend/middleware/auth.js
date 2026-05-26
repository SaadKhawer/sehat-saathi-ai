const { auth } = require('../config/firebase');

/**
 * Firebase Auth Middleware
 * Verifies the Firebase ID token from the Authorization header
 * Attaches the decoded user to req.user
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        messageUrdu: 'رسائی سے انکار۔ ٹوکن فراہم نہیں کیا گیا۔'
      });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || '',
      picture: decodedToken.picture || '',
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      messageUrdu: 'غلط یا ختم شدہ ٹوکن۔'
    });
  }
};

/**
 * Optional auth - doesn't block if no token, but attaches user if present
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await auth.verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || '',
      };
    }
  } catch (e) {
    // Silent fail - user just won't be authenticated
  }
  next();
};

module.exports = { authenticate, optionalAuth };
