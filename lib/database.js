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

  // Connect to MongoDB Atlas with username "belajar-mongodb", password "belajar-mongodb-hehe", and database name "NodeJs-Master-Class"
  mongoose.connect(
    "mongodb+srv://belajar-mongodb:belajar-mongodb-hehe@belajar.nsejf2x.mongodb.net/NodeJS-Master-Class?retryWrites=true&w=majority",
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
