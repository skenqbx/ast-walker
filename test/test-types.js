'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Walker = require('../');


suite('Walker.Types', function() {
  var types;

  test('new Walker.Types()', function() {
    types = new Walker.Types();
  });


  test('Types#keys(\'Property\')', function() {
    var keys = types.keys('Property');
    assert.deepEqual(keys, ['key', 'value', 'kind']);
  });


  test('Types#keys(\'Property\', true)', function() {
    var keys = types.keys('Property', true);
    assert.deepEqual(keys, ['key', 'value']);
  });
});
