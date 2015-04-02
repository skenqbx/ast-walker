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
  this.idx = -1;

  this.depth = opt_parent ? opt_parent.depth + 1 : 0;

  if (opt_idx !== undefined && opt_idx >= 0) {
    this.idx = opt_idx;
  }

  this.nodes = walker.types.keys(this.type, true);
  this._nodes = {};

  this.properties = walker.types.keys(this.type);
  this._properties = walker.types.unique[this.type];

  console.log('NODE', this.depth,
      (this.parent ? this.parent.type + '.' + this.property +
          (this.idx > -1 ? '[' + this.idx + '] > ' : ' > ') : '') +
              this.type);
}
module.exports = Node;


Node.prototype.p = function(property, opt_idx) {

};


Node.prototype.traverse = function() {
  var i, j;
  var property, type, value, node;
  var walker = this._walker;
  var skip = walker.skipProperties;

  for (i = 0; i < this.nodes.length; ++i) {
    property = this.nodes[i];

    if (skip.indexOf(property) > -1) {
      continue;
    }

    type = this._properties[property];
    value = this.node[property];

    // TODO: strict validation

    if (type.array) {
      if (!Array.isArray(value)) {
        throw new Error(
            'Property "' + this.type + '.' + property + '" is not an array');
      }
      this._nodes[property] = this._nodes[property] || [];

      for (j = 0; j < value.length; ++j) {
        if (this._nodes[property][j]) {
          node = this._nodes[property][j];
        } else {
          node = this._nodes[property][j] =
              new Node(walker, value[j], this, property, j);
        }

        this._emitAndTraverse(node);
      }

    } else {
      if (this._nodes[property]) {
        node = this._nodes[property];
      } else {
        node = this._nodes[property] = new Node(walker, value, this, property);
      }

      this._emitAndTraverse(node);
    }
  }
};


Node.prototype._emitAndTraverse = function(node) {
  var i, walker = this._walker;

  walker.emit('pre-' + node.type, node);
  for (i = 0; i < node._properties.__group.length; ++i) {
    walker.emit('pre-group-' + node._properties.__group[i], node);
  }

  node.traverse();

  walker.emit('post-' + node.type, node);
  for (i = 0; i < node._properties.__group.length; ++i) {
    walker.emit('post-group-' + node._properties.__group[i], node);
  }
};
