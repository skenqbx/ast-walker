'use strict';
var util = require('util');
var events = require('events');
var Node = require('./node');
var Types = require('./types');



/**
 * Walker
 *
 * @param {Object} ast
 * @param {?Object} opt_options
 */
function Walker(ast, opt_options) {
  if (!(this instanceof Walker)) {
    return new Walker(ast, opt_options);
  }
  events.EventEmitter.call(this);
  opt_options = opt_options || {};

  if (opt_options.types instanceof Types) {
    this.types = opt_options.types;
  } else {
    this.types = new Types(opt_options.types);
  }

  this.program = new Node(this, ast);

  this.skipProperties = opt_options.skipProperties || [];

  this._ast = ast;
}
util.inherits(Walker, events.EventEmitter);
module.exports = Walker;


Walker.prototype.traverse = function() {
  this.program.traverse();
};
