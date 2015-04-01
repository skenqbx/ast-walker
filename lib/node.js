'use strict';



/**
 * ASTNode
 *
 * @param {ASTWalker} walker
 * @param {Object} node
 * @param {?ASTNode} opt_parent
 * @param {?string} opt_property
 * @param {?number} opt_idx
 *
 * @constructor
 */
function ASTNode(walker, node, opt_parent, opt_property, opt_idx) {
  this._walker = walker;
  this.node = node;
  this.type = node.type;

  this.parent = opt_parent;
  this.property = opt_property;
  this.idx = opt_idx || -1;

  this._nodes = {};

  this.keys = walker.types.keys(this.type);
}
module.exports = ASTNode;


ASTNode.prototype.get = function(property, opt_idx) {
  if (opt_idx === undefined || opt_idx < 0) {

  } else {

  }
};


ASTNode.prototype._match = function(property, opt_idx) {
  var typeN = this._walker.types.get(this.type);
  var typeP = typeN[property];

  opt_idx = opt_idx || -1;

  if (!typeN) {
    throw new Error('Unkown type "' + this.type + '"');
  } else if (!typeP) {
    throw new Error('Unkown property "' + this.type + '.' + property + '"');
  }

  // TODO
};
