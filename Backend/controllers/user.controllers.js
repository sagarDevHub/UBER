import userModel from '../models/user.model.js';
import blacklistTokenModel from '../models/blacklistToken.model.js';
import userService from '../services/user.services.js';
import { validationResult } from 'express-validator';

export const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const normalizedEmail = email.toLowerCase();
    const isUserExist = await userModel.findOne({ email: normalizedEmail });
    if (isUserExist) {
      return res.status(400).json({ message: `Email already registered.` });
    }

    // Hashing the coming url from req body.
    const hashedPassword = await userModel.hashPassword(password);

    // Creating user using service.
    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
    });

    // Generating the token.
    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select(`+password`);

    if (!user) {
      return res.status(401).json({ message: `Invalid email or password` });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: `Invalid email or password` });
    }

    const token = user.generateAuthToken();

    res.cookie('token', token);
    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies?.token || (authHeader && authHeader.split(' ')[1]);

    if (token) {
      await blacklistTokenModel.create({ token });
      res.clearCookie('token');
    }

    res.status(200).json({ message: 'Logged out' });
  } catch (error) {
    next(error);
  }
};
