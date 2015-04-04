'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var fs = require('fs');
var assert = require('assert');
var espree = require('espree');
var common = require('./common');
var Walker = require('../');


suite('Node', function() {
  var walker;
  var source;
  var ast;

  suiteSetup(function(done) {
    fs.readFile(common.fixtures + '/ast.js', function(err, data) {
      if (err) {
        return done(err);
      }
      source = data.toString('utf8');
      ast = espree.parse(source, {
        range: true,
        loc: true,
        attachComment: true
      });

      done();
    });
  });


  test('Node#n()', function() {
    walker = new Walker(ast);

    walker.once('pre-AssignmentExpression', function(node) {
      var right = node.n('right');
      assert(right);
      assert(right === node.n('right'));
      assert.strictEqual(right.type, 'Literal');

      assert.throws(function() {
        node.n('expression');
      }, 'Unknown property "expression"');

      assert.throws(function() {
        node.n('operator');
      }, 'Property "operator" is not a node');
    });

    walker.traverse();
  });


  test('Node#n()', function() {
    walker = new Walker(ast);

    walker.once('pre-BlockStatement', function(node) {
      var body = node.n('body', 0);
      assert(body);

      var statements = node.n('body');
      assert(statements);

      assert(body === statements[0]);

      assert.throws(function() {
        node.n('body', 10);
      }, 'Unknown property "expression"');
    });

    walker.traverse();
  });


  test('Node#p()', function() {
    walker = new Walker(ast);

    walker.once('pre-AssignmentExpression', function(node) {
      var operator = node.p('operator');

      assert.strictEqual(operator, '=');

      assert.throws(function() {
        node.p('right');
      }, 'Property "right" is a node');
    });

    walker.traverse();
  });
});
