'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var ASTWalker = require('../');


suite('types', function() {
  var types;

  test('init', function() {
    types = new ASTWalker.Types();
  });

  suiteTeardown(function(done) {
    done();
  });
});
