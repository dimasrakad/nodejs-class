/*
 * Set up MongoDB database
 *
 */

// Dependency
const mongoose = require("mongoose");

// Container for database
var database = {};

// Init script
database.init = function () {
  // Configure mongoose
  mongoose.connect(
    "mongodb://localhost:27017/NodeJS-Master-Class",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Connected to MongoDB");
      }
    }
  );
};

// Export the module
module.exports = database;
