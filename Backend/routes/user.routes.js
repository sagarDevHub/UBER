import express from 'express';
import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/user.controllers.js';
import { body } from 'express-validator';
const router = Router();

// Register route
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname')
      .isLength({ min: 3 })
      .withMessage(`First name must be at least 3 characters long`),
    body('password').isLength({ min: 6 }).withMessage(`Password must be atleast 6 characters long`),
  ],
  registerUser
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage(`Password must be atleast 6 characters long`),
  ],
  loginUser
);

export default router;
