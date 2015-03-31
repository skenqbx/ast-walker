'use strict';
var util = require('util');
var events = require('events');
var ASTNode = require('./node');
var Types = require('./types');



function ASTWalker(ast, opt_options) {
  if (!(this instanceof ASTWalker)) {
    return new ASTWalker(ast, opt_options);
  }
  events.EventEmitter.call(this);
  opt_options = opt_options || {};

  this.types = new Types(opt_options.types);
  this.program = new ASTNode(this, ast);

  this.skipProperties = opt_options.skipProperties || null;

  this._ast = ast;
}
util.inherits(ASTWalker, events.EventEmitter);
module.exports = ASTWalker;


ASTWalker.prototype.walk = function() {
  var i, nodes = this.program.get('body');
};
