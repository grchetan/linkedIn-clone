const jwt = require('jsonwebtoken');

const tokenBlocklist = new Set();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing.' });
  }

  const token = authHeader.split(' ')[1];

  if (tokenBlocklist.has(token)) {
    return res.status(401).json({ message: 'Token is no longer valid. Please login again.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const logout = (req, res) => {
  if (req.token) {
    tokenBlocklist.add(req.token);
  }
  return res.json({ message: 'Logged out successfully.' });
};

module.exports = {
  authenticate,
  logout
};
