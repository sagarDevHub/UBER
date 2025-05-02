import blacklistTokenModel from '../models/blacklistToken.model.js';
import captainModel from '../models/captain.model.js';
import createCaptain from '../services/captain.services.js';
import { validationResult } from 'express-validator';

export const registerCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.errors = errors.array();
      throw error;
    }

    const { fullname, email, password, vehicle } = req.body;

    if (!fullname?.lastname) {
      const error = new Error('Firstname and lastname are required');
      error.statusCode = 400;
      throw error;
    }

    const isCaptainExist = await captainModel.findOne({ email });
    if (isCaptainExist) {
      const error = new Error('Captain already exists');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await createCaptain({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
      vehicle,
    });

    const token = captain.generateAuthToken();

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
    });

    const captainData = captain.toObject();
    delete captainData.password;

    res.status(201).json({
      success: true,
      message: `Captain registered successfully.`,
      data: {
        token,
        captain: captainData,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.errors = errors.array();
      throw error;
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');
    if (!captain) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token, {
      httpOnly: true,
    });

    const captainData = captain.toObject();
    delete captainData.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        captain: captainData,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCaptainProfile = async (req, res, next) => {
  try {
    if (!req.captain) {
      const error = new Error('Captain not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: {
        captain: req.captain,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutCaptain = async (req, res, next) => {
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
