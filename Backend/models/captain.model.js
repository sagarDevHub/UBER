import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const captainSchema = new mongoose.Schema({
  fullname: {
    type: new mongoose.Schema(
      {
        firstname: {
          type: String,
          required: true,
          minlength: [3, 'Firstname must be at least 3 characters long.'],
        },
        lastname: {
          type: String,
          minlength: [3, 'Lastname must be at least 3 characters long.'],
        },
      },
      { _id: false }
    ),
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  socketId: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
  },
  vehicle: {
    type: new mongoose.Schema(
      {
        color: {
          type: String,
          required: true,
          minlength: [3, 'Color must be at least 3 characters long.'],
        },
        plate: {
          type: String,
          required: true,
          minlength: [3, 'Plate must be at least 3 characters long.'],
        },
        capacity: {
          type: Number,
          required: true,
          min: [1, 'Capacity must be at least 1.'],
        },
        vehicleType: {
          type: String,
          required: true,
          enum: ['car', 'motorcycle', 'auto'],
        },
      },
      { _id: false }
    ),
    required: true,
  },
  location: {
    type: new mongoose.Schema(
      {
        lat: Number,
        lng: Number,
      },
      { _id: false }
    ),
  },
});

captainSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const captainModel = mongoose.model('captain', captainSchema);
export default captainModel;
