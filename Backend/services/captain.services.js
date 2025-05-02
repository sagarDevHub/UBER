import captainModel from '../models/captain.model.js';

const createCaptain = async ({ firstname, lastname, email, password, vehicle }) => {
  if (
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !vehicle ||
    !vehicle.color ||
    !vehicle.plate ||
    vehicle.capacity == null ||
    !vehicle.vehicleType
  ) {
    throw new Error('All fields are required.');
  }

  const captain = await captainModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    vehicle,
  });

  return captain;
};

export default createCaptain;
