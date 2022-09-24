/*
 * Unit Tests
 *
 */

// Dependencies
var helpers = require("../lib/helpers.js");
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

// Export the tests to the runner
module.exports = unit;
