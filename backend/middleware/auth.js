const jwt = require('jsonwebtoken');
const User = require('../models/User');

/*
  STRICT PROTECT
  Used for protected routes like:
  - profile
  - apply job
  - recruiter routes
*/
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return next();
    }

    return res.status(401).json({ message: 'Not authorized, no token' });
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

/*
  OPTIONAL PROTECT
  Used for routes like:
  - GET /jobs
  If token exists → attach user
  If not → continue without user
*/
const optionalProtect = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
    }

    next(); // Always continue
  } catch (error) {
    next(); // Even if token invalid, don't block
  }
};

const recruiterOnly = (req, res, next) => {
  if (req.user && req.user.role === 'recruiter') return next();
  return res.status(403).json({ message: 'Access denied: Recruiters only' });
};

const applicantOnly = (req, res, next) => {
  if (req.user && req.user.role === 'applicant') return next();
  return res.status(403).json({ message: 'Access denied: Applicants only' });
};

module.exports = { protect, optionalProtect, recruiterOnly, applicantOnly };