// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//   firstName: String,
//   lastName: String,
//   phone: String,
//   password: String,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("User", userSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = mongoose.model('User', {
  firstName: String,
  lastName: String,
  phone: String,
  hashedPassword: String,
  warehouse: {
    type: Schema.Types.ObjectId,
    ref: "Warehouse"
  }
});

module.exports = User;