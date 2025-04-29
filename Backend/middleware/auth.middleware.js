import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies?.token || (authHeader && authHeader.split(' ')[1]);

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const isBlacklisted = await userModel.findOne({ token: token });
    if (isBlacklisted) return res.status(401).json({ message: `Unauthorized` });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id).select('-password');

    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default authUser;
