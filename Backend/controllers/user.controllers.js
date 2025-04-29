import userModel from '../models/user.model.js';
import userService from '../services/user.services.js';
import { validationResult } from 'express-validator';

export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;

  const normalizedEmail = email.toLowerCase();
  const existingUser = await userModel.findOne({ email: normalizedEmail });
  if (existingUser) {
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
};

export const loginUser = async (req, res, next) => {
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
  res.status(200).json({ token, user });
};
