/*
 * warehouses handler
 *
 */

// Dependencies
const Warehouse = require("../../app/models/Warehouse");
const winston = require("winston");

var warehouses = function(data,callback){
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    _warehouses[data.method](data,callback);
  } else {
    callback(405);
  }
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/warehouses.log",
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    winston.format.printf(
      (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
    )
  ),
});

// Container for all the warehouses methods
_warehouses  = {};

// POST
_warehouses.post = function (data, callback) {
  // Check that all required fields are filled out
  var name =
    typeof data.payload.name == "string" &&
    data.payload.name.trim().length > 0
      ? data.payload.name.trim()
      : false;
  var location =
    typeof data.payload.location == "string" &&
    data.payload.location.trim().length > 0
      ? data.payload.location.trim()
      : false;
  var owner =
    typeof data.payload.owner == "string" &&
    data.payload.owner.trim().length > 0
      ? data.payload.owner.trim()
      : false;
  // var users =
  //   typeof data.payload.users == "Array" &&
  //   data.payload.users.length > 0
  //     ? data.payload.users
  //     : false;

  if (name && location && owner) {
    // Create the warehouse object
    var warehouseObject = {
      name: name,
      location: location,
      owner: owner
    };

    // Store the warehouse in data/warehouses directory with name as filename
    var warehouseData = new Warehouse(warehouseObject);

    warehouseData.save().then(
      (warehouse) => {
        callback(200, {warehouse});
        logger.info("200: Success creating new warehouse");
      },
      (e) => {
        callback(400, { Error: e });
        logger.error("400: " + e);
      }
    );
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};

// GET
_warehouses.get = function (data, callback) {
  // Check that name is valid
  var name =
    typeof data.queryStringObject.name == "string" &&
    data.queryStringObject.name.trim().length > 0
      ? data.queryStringObject.name.trim()
      : false;
  if (name) {
    // Lookup the warehouse
    Warehouse.find({ name: name })
      .then((warehouse) => {
        if (!warehouse) {
          return callback(404, { Error: "Not Found" });
        }
        callback(200, { warehouse });
        logger.info("200: Success getting warehouse's data");
      })
      .catch((e) => {
        callback(400, { Error: e });
        logger.error("400: " + e);
      });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// PUT
_warehouses.put = function (data, callback) {
  // Check for required field
  var name =
    typeof data.payload.name == "string" &&
    data.payload.name.trim().length > 0
      ? data.payload.name.trim()
      : false;

  // Check for optional fields
  var location =
    typeof data.payload.location == "string" &&
    data.payload.location.trim().length > 0
      ? data.payload.location.trim()
      : false;

  var owner =
    typeof data.payload.owner == "string" &&
    data.payload.owner.trim().length > 0
      ? data.payload.owner.trim()
      : false;

  // Error if name is invalid
  if (name) {
    // Error if nothing is sent to update
    if (location || owner) {
      var update = {};

      if (location) {
        update.location = location;
      }
      if (owner) {
        update.owner = owner;
      }
      Warehouse.findOneAndUpdate({name: name}, {$set: update}, {new: true}).then(
        (warehouse) => {
          callback(200, {warehouse});
          logger.info("200: Success updating warehouse's data");
        },
        (e) => {
          callback(400, { Error: e });
          logger.error("400: " + e);
        }
      );
    } else {
      callback(400, { Error: "Missing fields to update." });
    }
  } else {
    callback(400, { Error: "Missing required field." });
  }
};

// DELETE
_warehouses.delete = function (data, callback) {
  // Check that name is valid
  var name =
    typeof data.queryStringObject.name == "string" &&
    data.queryStringObject.name.trim().length > 0
      ? data.queryStringObject.name.trim()
      : false;
  if (name) {
    // Lookup the warehouse
    Warehouse.findOneAndDelete({name: name}).then(
    (warehouse) => {
      callback(200);
      logger.info("200: Success deleting the warehouse");
    },
    (e) => {
      callback(400, { Error: e });
      logger.error("400: " + e);
    }
  );
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Export the handler
module.exports = warehouses;
