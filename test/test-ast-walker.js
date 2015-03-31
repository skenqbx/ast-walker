'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var fs = require('fs');
var assert = require('assert');
var espree = require('espree');
var ASTWalker = require('../');


suite('ast-walker', function() {
  var walker;

  suiteSetup(function(done) {
    var source = ''; // TODO: load file
    var ast = espree.parse(source, {
      range: true,
      loc: true,
      attachComment: true
    });

    walker = new ASTWalker(ast);

    done();
  });

  test('dummy', function() {});

  suiteTeardown(function(done) {
    done();
  });
});
