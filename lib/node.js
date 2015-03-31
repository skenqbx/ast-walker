'use strict';



function ASTNode(walker, node, opt_parent, opt_property, opt_idx) {
  this._walker = walker;
  this.node = node;
  this.type = node.type;

  this.parent = opt_parent;
  this.property = opt_property;
  this.idx = opt_idx || -1;

  this._nodes = {};
}
module.exports = ASTNode;


ASTNode.prototype.keys = function() {

};


ASTNode.prototype.get = function(property) {

};
