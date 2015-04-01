'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var fs = require('fs');
var assert = require('assert');
var espree = require('espree');
var common = require('./common');
var Walker = require('../');


suite('Walker', function() {
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


  test('Walker#traverse()', function() {
    walker = new Walker(ast, {
      skipProperties: ['cases']
    });

    var events = {
      SwitchCase: {pre: 0, post: 0},
      FunctionExpression: {pre: 0, post: 0},
      FunctionDeclaration: {pre: 0, post: 0},
      MemberExpression: {pre: 0, post: 0},
      AssignmentExpression: {pre: 0, post: 0}
    };
    var i, keys = Object.keys(events);
    var nodeEventCount = 0;

    function onEvent(event) {
      walker.on('pre' + event, function(node) {
        assert(node);
        assert(node.type);

        ++events[event].pre;
      });

      walker.on('post' + event, function(node) {
        assert(node);
        assert(node.type);

        ++events[event].post;
      });
    }

    walker.on('node', function(node) {
      ++nodeEventCount;
    });

    for (i = 0; i < keys.length; ++i) {
      onEvent(keys[i]);
    }

    walker.traverse();

    assert.strictEqual(events.FunctionExpression.pre, 1);
    assert.strictEqual(events.FunctionExpression.post, 1);

    assert.strictEqual(events.FunctionDeclaration.pre, 2);
    assert.strictEqual(events.FunctionDeclaration.post, 2);

    assert.strictEqual(events.MemberExpression.pre, 4);
    assert.strictEqual(events.MemberExpression.post, 4);

    assert.strictEqual(events.AssignmentExpression.pre, 2);
    assert.strictEqual(events.AssignmentExpression.post, 2);

    assert.strictEqual(events.SwitchCase.pre, 0);
    assert.strictEqual(events.SwitchCase.post, 0);

    assert.strictEqual(nodeEventCount, 11);
  });
});
