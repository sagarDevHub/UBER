import userModel from '../models/user.model.js';

const createUser = async ({ firstname, lastname, email, password }) => {
  try {
    if (!firstname || !email || !password) {
      const error = new Error('All fields are required');
      error.statusCode = 400;
      throw error;
    }

    const user = userModel.create({
      fullname: {
        firstname,
        lastname: lastname || '',
      },
      email,
      password,
    });

    return user;
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email) {
      const err = new Error('Email already exists');
      err.statusCode = 409;
      throw err;
    }
    throw error;
  }
};

export default { createUser };
