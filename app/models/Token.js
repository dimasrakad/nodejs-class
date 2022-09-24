const mongoose = require('mongoose');

const Token = mongoose.model('Token', {
  phone: String,
  password: String,
});

module.exports = Token;