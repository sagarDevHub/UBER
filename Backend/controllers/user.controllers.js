import userModel from '../models/user.model.js';
import blacklistTokenModel from '../models/blacklistToken.model.js';
import userService from '../services/user.services.js';
import { validationResult } from 'express-validator';

export const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.errors = errors.array();
      throw error;
    }

    const { fullname, email, password } = req.body;

    if (!fullname?.firstname) {
      const error = new Error('Firstname is required');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.toLowerCase();
    const isUserExist = await userModel.findOne({ email: normalizedEmail });
    if (isUserExist) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      throw error;
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

    res.cookie('token', token, {
      httpOnly: true,
    });

    // Remove sensitive data before sending response
    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.errors = errors.array();
      throw error;
    }

    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select(`+password`);

    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const token = user.generateAuthToken();

    res.cookie('token', token, {
      httpOnly: true,
    });

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
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
      res.clearCookie('token', {
        httpOnly: true,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};
