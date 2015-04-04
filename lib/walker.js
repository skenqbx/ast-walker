'use strict';
var util = require('util');
var events = require('events');
var Node = require('./node');
var Types = require('./types');



/**
 * Walker
 *
 * @param {Object} tree The tree to traverse
 * @param {?Object} opt_options The walker configuration
 */
function Walker(tree, opt_options) {
  if (!(this instanceof Walker)) {
    return new Walker(tree, opt_options);
  }
  events.EventEmitter.call(this);
  opt_options = opt_options || {};

  if (opt_options.types instanceof Types) {
    this.types = opt_options.types;
  } else {
    this.types = new Types(opt_options.types);
  }

  this.root = new Node(this, tree);
  this.skipProperties = opt_options.skipProperties || [];

  this._tree = tree;
}
util.inherits(Walker, events.EventEmitter);
module.exports = Walker;


Walker.prototype.traverse = function() {
  this.root.traverse();
};
