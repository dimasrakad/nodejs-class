/*
 * Unit Tests
 *
 */

// Dependencies
var helpers = require("./../lib/helpers.js");
var logs = require("./../lib/logs.js");
var assert = require("assert");

// Holder for Tests
var unit = {};

// Assert that the get1 function is returning a number
unit["helpers.get1 should return a number"] = function (done) {
  var val = helpers.get1();
  assert.equal(typeof val, "number");
  done();
};

// Assert that the ge1 function is returning 1
unit["helpers.get1 should return 1"] = function (done) {
  var val = helpers.get1();
  assert.equal(val, 1);
  done();
};

// Assert that the get1 function is returning 2
unit["helpers.get1 should return 2"] = function (done) {
  var val = helpers.get1();
  assert.equal(val, 2);
  done();
};

// Logs.list should callback an array and a false error
unit["logs.list should callback a false error and an array of log names"] =
  function (done) {
    logs.list(true, function (err, logFileNames) {
      assert.equal(err, false);
      assert.ok(logFileNames instanceof Array);
      assert.ok(logFileNames.length > 1);
      done();
    });
  };

// Logs.truncate should not throw if the logId doesnt exist
unit[
  "logs.truncate should not throw if the logId does not exist, should callback an error instead"
] = function (done) {
  assert.doesNotThrow(function () {
    logs.truncate("I do not exist", function (err) {
      assert.ok(err);
      done();
    });
  }, TypeError);
};

// Export the tests to the runner
module.exports = unit;
