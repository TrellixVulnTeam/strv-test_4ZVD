const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Set user schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: 'Email address is required!',
    lowercase: true,
    unique: true,
    trim: true,
    max: 100,
    match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    min: [6, 'The passowrd needs to be at least 6 characters long!'],
    required: true
  },
  fName: {
    type: String,
    max: 100,
    required: false
  },
  lName: {
    type: String,
    max: 100,
    required: false
  }
});

// Full user name
UserSchema.virtual('fullName').get(() => {
  return this.lName.toUpperCase() + ", " + this.fName;
});

UserSchema.pre('save', (next) => {
  const currentDate = new Date();

  this.createdAt = currentDate;
  next();
});

module.exports = mongoose.model('User', UserSchema);
