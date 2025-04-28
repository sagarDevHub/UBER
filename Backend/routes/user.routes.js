import express from 'express';
import { Router } from 'express';
import { registerUser } from '../controllers/user.controllers.js';
import { body } from 'express-validator';
const router = Router();

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

export default router;
