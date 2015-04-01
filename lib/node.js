'use strict';



/**
 * Node
 *
 * @param {Walker} walker
 * @param {Object} node
 * @param {?Node} opt_parent
 * @param {?string} opt_property
 * @param {?number} opt_idx
 *
 * @constructor
 */
function Node(walker, node, opt_parent, opt_property, opt_idx) {
  this._walker = walker;
  this.node = node;
  this.type = node.type;

  this.parent = opt_parent;
  this.property = opt_property;
  this.idx = opt_idx || -1;

  this.nodes = walker.types.keys(this.type, true);
  this.properties = walker.types.keys(this.type);

  this._nodes = {};
}
module.exports = Node;


Node.prototype.p = function(property, opt_idx) {
};


Node.prototype.traverse = function() {
  var i, j;

  for (i = 0; i < this.nodes.length; ++i) {

  }
};
