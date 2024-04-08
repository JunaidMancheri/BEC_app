const {Schema, model, connect, disconnect} = require('mongoose');
const bcrypt = require('bcrypt');
require('@dotenvx/dotenvx').config();

if (!process.env.MONGODB_URL) throw new Error('MONGODB_URL is required');
if (!process.env.EMAIL) throw new Error('EMAIL is required');
if (!process.env.PASSWORD) throw new Error('PASSWORD is required');

connect(process.env.MONGODB_URL).then(async () => {
  const adminSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hashPassword: {
      type: String,
      required: true,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  });

  const adminModel = model('admins', adminSchema);
  const hash = await bcrypt.hash(process.env.PASSWORD, 10);

  adminModel
    .create({
      email: process.env.EMAIL,
      hashPassword: hash,
      isBlocked: false,
      isSuperAdmin: true,
    })
    .then(() => {
      console.log('super admin created  with email ' + process.env.EMAIL);
    })
    .catch(error => {
      if (error.code === 11000) console.log('admin already exists');
    })
    .finally(() => disconnect());
});
