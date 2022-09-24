/*
 * CLI-related tasks
 *
 */

// Dependencies
var readline = require("readline");
var util = require("util");
var debug = util.debuglog("cli");
var events = require("events");
class _events extends events {}
var e = new _events();
var os = require("os");
var v8 = require("v8");
var _data = require("./data");
var helpers = require("./helpers");
var fs = require("fs");
var path = require("path");

// Instantiate the cli module object
var cli = {};

// Input handlers
e.on("man", function (str) {
  cli.responders.help();
});

e.on("help", function (str) {
  cli.responders.help();
});

e.on("exit", function (str) {
  cli.responders.exit();
});

e.on("list users", function (str) {
  cli.responders.listUsers();
});

e.on("more user info", function (str) {
  cli.responders.moreUserInfo(str);
});

e.on("create crud", function (str) {
  cli.responders.createCRUD(str);
});

// Responders object
cli.responders = {};

// Help / Man
cli.responders.help = function () {
  // Codify the commands and their explanations
  var commands = {
    exit: "Kill the CLI (and the rest of the application)",
    man: "Show this help page",
    help: 'Alias of the "man" command',
    "list users":
      "Show a list of all the registered (undeleted) users in the system",
    "more user info --{userId}": "Show details of a specified user",
    "create crud --{fileName}": "Create CRUD file",
  };

  // Show a header for the help page that is as wide as the screen
  cli.horizontalLine();
  cli.centered("CLI MANUAL");
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Show each command, followed by its explanation, in white and yellow respectively
  for (var key in commands) {
    if (commands.hasOwnProperty(key)) {
      var value = commands[key];
      var line = "      \x1b[33m " + key + "      \x1b[0m";
      var padding = 60 - line.length;
      for (i = 0; i < padding; i++) {
        line += " ";
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }
  cli.verticalSpace(1);

  // End with another horizontal line
  cli.horizontalLine();
};

// Create a vertical space
cli.verticalSpace = function (lines) {
  lines = typeof lines == "number" && lines > 0 ? lines : 1;
  for (i = 0; i < lines; i++) {
    console.log("");
  }
};

// Create a horizontal line across the screen
cli.horizontalLine = function () {
  // Get the available screen size
  var width = process.stdout.columns;

  // Put in enough dashes to go across the screen
  var line = "";
  for (i = 0; i < width; i++) {
    line += "-";
  }
  console.log(line);
};

// Create centered text on the screen
cli.centered = function (str) {
  str = typeof str == "string" && str.trim().length > 0 ? str.trim() : "";

  // Get the available screen size
  var width = process.stdout.columns;

  // Calculate the left padding there should be
  var leftPadding = Math.floor((width - str.length) / 2);

  // Put in left padded spaces before the string itself
  var line = "";
  for (i = 0; i < leftPadding; i++) {
    line += " ";
  }
  line += str;
  console.log(line);
};

// Exit
cli.responders.exit = function () {
  process.exit(0);
};

// List Users
cli.responders.listUsers = function () {
  _data.list("users", function (err, userIds) {
    if (!err && userIds && userIds.length > 0) {
      cli.verticalSpace();
      userIds.forEach(function (userId) {
        _data.read("users", userId, function (err, userData) {
          if (!err && userData) {
            var line =
              "Name: " +
              userData.firstName +
              " " +
              userData.lastName +
              " | Phone: " +
              userData.phone +
              " | Checks: ";
            var numberOfChecks =
              typeof userData.checks == "object" &&
              userData.checks instanceof Array &&
              userData.checks.length > 0
                ? userData.checks.length
                : 0;
            line += numberOfChecks;
            console.log(line);
            cli.verticalSpace();
          }
        });
      });
    }
  });
};

// More user info
cli.responders.moreUserInfo = function (str) {
  cli.responders.moreUserInfo = function (str) {
    // Get ID from string
    var arr = str.split("--");
    var userId =
      typeof arr[1] == "string" && arr[1].trim().length > 0
        ? arr[1].trim()
        : false;
    if (userId) {
      // Lookup the user
      _data.read("users", userId, function (err, userData) {
        if (!err && userData) {
          // Remove the hashed password
          delete userData.hashedPassword;

          // Print their JSON object with text highlighting
          cli.verticalSpace();
          console.dir(userData, { colors: true });
          cli.verticalSpace();
        }
      });
    }
  };
};

// Create CRUD
cli.responders.createCRUD = function (str) {
  // Get crudFileName from string
  var arr = str.split("--");
  var crudFileName =
    typeof arr[1] == "string" && arr[1].trim().length > 0
      ? arr[1].trim().concat("s")
      : false;
  // Create a file named according to crudFileName in directory lib/crud/ with predefined contents
  fs.writeFile(
    path.join(__dirname, "/crud/") + crudFileName + ".js",
    `/*
 * ${crudFileName} handler
 *
 */

// Dependencies
const winston = require("winston");
const ${
      crudFileName.charAt(0).toUpperCase() + crudFileName.slice(1, -1)
    } = require("../../app/models/${
      crudFileName.charAt(0).toUpperCase() + crudFileName.slice(1, -1)
    }");

var ${crudFileName} = function(data,callback){
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    _${crudFileName}[data.method](data,callback);
  } else {
    callback(405);
  }
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/${crudFileName}.log",
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    winston.format.printf(
      (info) => \`\${info.level}: \${[info.timestamp]}: \${info.message}\`
    )
  ),
});

// Container for all the ${crudFileName} methods
_${crudFileName}  = {};

// POST
_${crudFileName}.post = function (data, callback) {
  // Check that all required fields are filled out
  var field1 =
    typeof data.payload.field1 == "string" &&
    data.payload.field1.trim().length > 0
      ? data.payload.field1.trim()
      : false;
  var field2 =
    typeof data.payload.field2 == "string" &&
    data.payload.field2.trim().length > 0
      ? data.payload.field2.trim()
      : false;
  var field3 =
    typeof data.payload.field3 == "string" &&
    data.payload.field3.trim().length > 0
      ? data.payload.field3.trim()
      : false;

  if (field1 && field2 && field3) {
    // Create the ${crudFileName.slice(0, -1)} object
    var ${crudFileName.slice(0, -1)}Object = {
      field1: field1,
      field2: field2,
      field3: field3,
    };

    // Store the ${crudFileName.slice(
      0,
      -1
    )} in data/${crudFileName} directory with field1 as filename
    var ${crudFileName.slice(0, -1)}Data = new ${
      crudFileName.charAt(0).toUpperCase() + crudFileName.slice(1, -1)
    }(${crudFileName.slice(0, -1)}Object);

    ${crudFileName.slice(0, -1)}Data.save().then(
      (${crudFileName.slice(0, -1)}) => {
        callback(200, {${crudFileName.slice(0, -1)}});
        logger.info("200: Success creating new ${crudFileName.slice(0, -1)}");
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
_${crudFileName}.get = function (data, callback) {
  // Check that field1 is valid
  var field1 =
    typeof data.queryStringObject.field1 == "string" &&
    data.queryStringObject.field1.trim().length > 0
      ? data.queryStringObject.field1.trim()
      : false;
  if (field1) {
    // Lookup the ${crudFileName.slice(0, -1)}
    ${
      crudFileName.charAt(0).toUpperCase() + crudFileName.slice(1, -1)
    }.find({ field1: field1 })
      .then((${crudFileName.slice(0, -1)}) => {
        if (!${crudFileName.slice(0, -1)}) {
          return callback(404, { Error: "Not Found" });
        }
        callback(200, { ${crudFileName.slice(0, -1)} });
        logger.info("200: Success getting ${crudFileName.slice(0, -1)}'s data");
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
_${crudFileName}.put = function (data, callback) {
  // Check for required field
  var field1 =
    typeof data.payload.field1 == "string" &&
    data.payload.field1.trim().length > 0
      ? data.payload.field1.trim()
      : false;

  // Check for optional fields
  var field2 =
    typeof data.payload.field2 == "string" &&
    data.payload.field2.trim().length > 0
      ? data.payload.field2.trim()
      : false;

  var field3 =
    typeof data.payload.field3 == "string" &&
    data.payload.field3.trim().length > 0
      ? data.payload.field3.trim()
      : false;

  // Error if field1 is invalid
  if (field1) {
    // Error if nothing is sent to update
    if (field2 || field3) {
      var update = {};

      if (field2) {
        update.field2 = field2;
      }
      if (field3) {
        update.field3 = field3;
      }
      ${
        crudFileName.charAt(0).toUpperCase() + crudFileName.slice(1, -1)
      }.findOneAndUpdate({field1: field1}, {$set: update}, {new: true}).then(
        (${crudFileName.slice(0, -1)}) => {
          callback(200, {${crudFileName.slice(0, -1)}});
          logger.info("200: Success updating ${crudFileName.slice(0, -1)}'s data");
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
_${crudFileName}.delete = function (data, callback) {
  // Check that field1 is valid
  var field1 =
    typeof data.queryStringObject.field1 == "string" &&
    data.queryStringObject.field1.trim().length > 0
      ? data.queryStringObject.field1.trim()
      : false;
  if (field1) {
    // Lookup the ${crudFileName.slice(0, -1)}
    ${
      crudFileName.charAt(0).toUpperCase() + crudFileName.slice(1, -1)
    }.findOneAndDelete({field1: field1}).then(
    (${crudFileName.slice(0, -1)}) => {
      callback(200);
      logger.info("200: Success deleting the ${crudFileName.slice(0, -1)}");
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
module.exports = ${crudFileName};
`,
    function (err) {
      if (err) throw err;
      console.log(
        "Handler file " + crudFileName + ".js is created successfully"
      );
    }
  );

  // Create a file named according to crudFileName in directory app/models/ with predefined contents
  fs.writeFile(
    path.join(__dirname, "/../app/models/") +
      crudFileName.charAt(0).toUpperCase() +
      crudFileName.slice(1, -1) +
      ".js",
    `const mongoose = require('mongoose');

const ${
      crudFileName.charAt(0).toUpperCase() + crudFileName.slice(1, -1)
    } = mongoose.model('${
      crudFileName.charAt(0).toUpperCase() + crudFileName.slice(1, -1)
    }', {
  field1: String,
  field2: String,
  field3: String
});

module.exports = ${
      crudFileName.charAt(0).toUpperCase() + crudFileName.slice(1, -1)
    };
`,
    function (err) {
      if (err) throw err;
      console.log(
        "Model file " +
          crudFileName.charAt(0).toUpperCase() +
          crudFileName.slice(1, -1) +
          ".js is created successfully"
      );
    }
  );

  // Add CRUD dependency and router to the server.js file
  var serverFilePath = path.join(__dirname, "/server.js");
  fs.readFile(serverFilePath, function (err, data) {
    if (err) {
      return console.log(err);
    }

    var obj = {
      'var handlers = require("./handlers");': `var handlers = require("./handlers");
var ${crudFileName} = require("./crud/${crudFileName}");`,
      '"api/checks": handlers.checks,': `"api/checks": handlers.checks,
  "api/${crudFileName}": ${crudFileName},`,
    };

    var RE = new RegExp(Object.keys(obj).join("|"), "gi");

    var result1 = data.toString().replace(RE, function (matched) {
      return obj[matched];
    });

    fs.writeFile(serverFilePath, result1, function (err) {
      if (err) return console.log(err);
    });
  });

  // fs.readFile(serverFilePath, function (err, data) {
  //   if (err) {
  //     return console.log(err);
  //   }

  //   var result2 = data.toString().replace(
  //     '"api/checks": handlers.checks,',
  //     `"api/checks": handlers.checks,
  // "api/${crudFileName}": ${crudFileName}handler,`
  //   );

  //   fs.writeFile(serverFilePath, result2, function (err) {
  //     if (err) return console.log(err);
  //   });
  // });

  var dataDir = path.join(__dirname, "/../.data/" + crudFileName);

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Input processor
cli.processInput = function (str) {
  str = typeof str == "string" && str.trim().length > 0 ? str.trim() : false;
  // Only process the input if the user actually wrote something, otherwise ignore it
  if (str) {
    // Codify the unique strings that identify the different unique questions allowed be the asked
    var uniqueInputs = [
      "man",
      "help",
      "exit",
      "list users",
      "more user info",
      "create crud",
    ];

    // Go through the possible inputs, emit event when a match is found
    var matchFound = false;
    var counter = 0;
    uniqueInputs.some(function (input) {
      if (str.toLowerCase().indexOf(input) > -1) {
        matchFound = true;
        // Emit event matching the unique input, and include the full string given
        e.emit(input, str);
        return true;
      }
    });

    // If no match is found, tell the user to try again
    if (!matchFound) {
      console.log("Sorry, try again");
    }
  }
};

// Init script
cli.init = function () {
  // Send to console, in dark blue
  console.log("\x1b[34m%s\x1b[0m", "The CLI is running");

  // Start the interface
  var _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "",
  });

  // Create an initial prompt
  _interface.prompt();

  // Handle each line of input separately
  _interface.on("line", function (str) {
    // Send to the input processor
    cli.processInput(str);

    // Re-initialize the prompt afterwards
    _interface.prompt();
  });

  // If the user stops the CLI, kill the associated process
  _interface.on("close", function () {
    process.exit(0);
  });
};

// Export the module
module.exports = cli;
