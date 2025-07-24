
import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  console.log('Authorization Header:', req.headers.authorization);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Token missing or malformed');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  console.log('🔐 Extracted Token:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified. Payload:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export default verifyToken; // ✅ Default export
