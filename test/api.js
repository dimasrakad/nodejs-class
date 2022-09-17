/*
 * API Tests
 *
 */

// Dependencies
var app = require("./../index");
var assert = require("assert");
var http = require("http");
var config = require("./../lib/config");

// Holder for Tests
var api = {};

// Helpers
var helpers = {};
helpers.makeRequest = function (path, method, callback) {
  // Configure the request details
  var requestDetails = {
    protocol: "http:",
    hostname: "localhost",
    port: config.httpPort,
    method: method,
    path: path,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Send the request
  var req = http.request(requestDetails, function (res) {
    callback(res);
  });
  req.end();
};

// The main init() function should be able to run without throwing.
api["app.init should start without throwing"] = function (done) {
  assert.doesNotThrow(function () {
    app.init(function (err) {
      done();
    });
  }, TypeError);
};

// Make a request to /ping
api["/ping should respond to GET with 200"] = function (done) {
  helpers.makeRequest("/ping", "GET", function (res) {
    assert.equal(res.statusCode, 200);
    done();
  });
};

// Make a request to /api/users
api["/api/users should respond to GET with 400"] = function (done) {
  helpers.makeRequest("/api/users", "GET", function (res) {
    assert.equal(res.statusCode, 400);
    done();
  });
};

api["/api/users should respond to POST with 400"] = function (done) {
  helpers.makeRequest("/api/users", "POST", function (res) {
    assert.equal(res.statusCode, 400);
    done();
  });
};

api["/api/users should respond to PUT with 400"] = function (done) {
  helpers.makeRequest("/api/users", "PUT", function (res) {
    assert.equal(res.statusCode, 400);
    done();
  });
};

api["/api/users should respond to DELETE with 400"] = function (done) {
  helpers.makeRequest("/api/users", "DELETE", function (res) {
    assert.equal(res.statusCode, 400);
    done();
  });
};

// Make a request to /api/tokens
api["/api/tokens should respond to GET with 400"] = function (done) {
  helpers.makeRequest("/api/tokens", "GET", function (res) {
    assert.equal(res.statusCode, 400);
    done();
  });
};

api["/api/tokens should respond to POST with 400"] = function (done) {
  helpers.makeRequest("/api/tokens", "POST", function (res) {
    assert.equal(res.statusCode, 400);
    done();
  });
};

api["/api/tokens should respond to PUT with 400"] = function (done) {
  helpers.makeRequest("/api/tokens", "PUT", function (res) {
    assert.equal(res.statusCode, 400);
    done();
  });
};

api["/api/tokens should respond to DELETE with 400"] = function (done) {
  helpers.makeRequest("/api/tokens", "DELETE", function (res) {
    assert.equal(res.statusCode, 400);
    done();
  });
};

// Make a request to /api/checks
api["/api/checks should respond to GET with 400"] = function (done) {
  helpers.makeRequest("/api/checks", "GET", function (res) {
    assert.equal(res.statusCode, 400);
    done();
  });
};

api["/api/checks should respond to POST with 400"] = function (done) {
  helpers.makeRequest("/api/checks", "POST", function (res) {
    assert.equal(res.statusCode, 400);
    done();
  });
};

api["/api/checks should respond to PUT with 400"] = function (done) {
  helpers.makeRequest("/api/checks", "PUT", function (res) {
    assert.equal(res.statusCode, 400);
    done();
  });
};

api["/api/checks should respond to DELETE with 400"] = function (done) {
  helpers.makeRequest("/api/checks", "DELETE", function (res) {
    assert.equal(res.statusCode, 400);
    done();
  });
};

// Make a request to a random path
api["A random path should respond to GET with 404"] = function (done) {
  helpers.makeRequest("/this/path/shouldnt/exist", "GET", function (res) {
    assert.equal(res.statusCode, 404);
    done();
  });
};

// Export the tests to the runner
module.exports = api;
