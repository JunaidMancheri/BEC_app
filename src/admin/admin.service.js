const bcrypt  = require('bcrypt');
const {Conflict} = require('http-errors');
const { AdminModel } = require('./model');

exports.createAdmin = async (email, password) => {
  const hash = await bcrypt.hash(password, 10)
  try {
    const admin = await AdminModel.create({
      email,
      hashPassword: hash,
      isBlocked: false,
      isSuperAdmin: false
    })
  
    return admin;
  } catch (error) {
    if (error.code === 11000) {
      throw new Conflict('Admin already exists');
    }
    throw error;
  }
}

exports.getAdminDetails = async (email) => {
  return AdminModel.findOne({email});
}

exports.resetPassword = async(email, password) => {
  const hash = await bcrypt.hash(password, 10)
  await AdminModel.findOneAndUpdate({email}, {hashPassword: hash});
}
