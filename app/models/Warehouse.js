const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Warehouse = mongoose.model('Warehouse', {
  name: String,
  location: String,
  owner: String,
  user: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }]
});

module.exports = Warehouse;
