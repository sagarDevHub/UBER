import userModel from '../models/user.model.js';
import userService from '../services/user.services.js';
import { validationResult } from 'express-validator';

export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;
  // Hashing the coming url from req body.
  const hashedPassword = await userModel.hashPassword(password);

  // Creating the service from userService.
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
