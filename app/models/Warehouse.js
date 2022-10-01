const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Warehouse = mongoose.model('Warehouse', {
  name: String,
  location: String,
  owner: String,
  user: []
});

module.exports = Warehouse;
