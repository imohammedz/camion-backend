// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { RolesList } = require('../utils/roles');  

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: {type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: RolesList,  // ✅ Use dynamic roles
    default: 'DEFAULT_USER' // Default role if none is specified so the existing code doesnt break
    //clean this once roles are set and DB cleanup is done
  }
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
