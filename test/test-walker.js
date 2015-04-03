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
      SwitchCase: true,
      FunctionExpression: true,
      FunctionDeclaration: true,
      MemberExpression: true,
      AssignmentExpression: true,
      'group-Node': true,
      'group-Expression': true,
      'group-Statement': true,
      'group-Declaration': true,
      'group-Function': true
    };
    var i, keys = Object.keys(events);

    function onEvent(event) {
      events[event] = {pre: 0, post: 0};

      walker.on('pre-' + event, function(node) {
        assert(node);
        assert(node.type);

        ++events[event].pre;
      });

      walker.on('post-' + event, function(node) {
        assert(node);
        assert(node.type);

        ++events[event].post;
      });
    }

    for (i = 0; i < keys.length; ++i) {
      onEvent(keys[i]);
    }

    walker.traverse();

    assert.strictEqual(events.FunctionExpression.pre, 1);
    assert.strictEqual(events.FunctionExpression.post, 1);

    assert.strictEqual(events.FunctionDeclaration.pre, 2);
    assert.strictEqual(events.FunctionDeclaration.post, 2);

    assert.strictEqual(events.MemberExpression.pre, 5);
    assert.strictEqual(events.MemberExpression.post, 5);

    assert.strictEqual(events.AssignmentExpression.pre, 3);
    assert.strictEqual(events.AssignmentExpression.post, 3);

    assert.strictEqual(events.SwitchCase.pre, 0);
    assert.strictEqual(events.SwitchCase.post, 0);

    assert.strictEqual(events['group-Node'].pre, 40);
    assert.strictEqual(events['group-Node'].post, 40);

    assert.strictEqual(events['group-Expression'].pre, 11);
    assert.strictEqual(events['group-Expression'].post, 11);

    assert.strictEqual(events['group-Statement'].pre, 9);
    assert.strictEqual(events['group-Statement'].post, 9);

    assert.strictEqual(events['group-Declaration'].pre, 2);
    assert.strictEqual(events['group-Declaration'].post, 2);

    assert.strictEqual(events['group-Function'].pre, 3);
    assert.strictEqual(events['group-Function'].post, 3);
  });
});
