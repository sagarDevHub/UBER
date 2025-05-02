import blacklistTokenModel from '../models/blacklistToken.model.js';
import captainModel from '../models/captain.model.js';
import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const getTokenFromRequest = req => {
  if (req.cookies?.token) return req.cookies.token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) return authHeader.split(' ')[1];

  return null;
};

export const authUser = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      const error = new Error(`Unauthorized: No token provided.`);
      error.statusCode = 401;
      throw error;
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token: token });
    if (isBlacklisted) {
      const error = new Error(`Unauthorized: Token revoked`);
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id).select('-password');

    if (!user) {
      const error = new Error(`User not found`);
      error.statusCode = 404;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      error.message = 'Invalid token';
      error.statusCode = 401;
    }
    next(error);
  }
};

export const authCaptain = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      const error = new Error('Unauthorized: No token provided');
      error.statusCode = 401;
      throw error;
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
      const error = new Error('Unauthorized: Token revoked');
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findById(decoded._id).select('-password');

    if (!captain) {
      const error = new Error('Captain not found');
      error.statusCode = 404;
      throw error;
    }

    req.captain = captain;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      error.message = 'Invalid token';
      error.statusCode = 401;
    }
    next(error);
  }
};
