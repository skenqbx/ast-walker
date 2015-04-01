'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Walker = require('../');


suite('Walker.Types', function() {
  var types;

  test('init', function() {
    types = new Walker.Types();
  });

  suiteTeardown(function(done) {
    done();
  });
});
