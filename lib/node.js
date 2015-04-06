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

  if (this.parent) {
    if (opt_idx !== undefined && opt_idx >= 0) {
      this.idx = opt_idx;
    }

    this.depth = this.parent.depth + 1;
    this.name = this.parent.type + '.' + this.property +
        (this.idx > -1 ? '[' + this.idx + ']' : '');

    this.path = this.parent.path.slice();
    this.path.push(this.parent.name);

  } else {
    this.depth = 0;
    this.name = this.type;
    this.path = [];
  }

  this.nodes = walker.types.keys(this.type, true);
  this._nodes = {};
  this._properties = walker.types.unique[this.type];
}
module.exports = Node;


Node.prototype.p = function(property) {
  if (this.nodes.indexOf(property) > -1) {
    throw new Error('Property "' + property + '" is a node');
  }

  return this.node[property];
};


Node.prototype.n = function(property, opt_idx) {
  var i, value;
  var desc = this._properties[property];

  if (!desc) {
    throw new Error('Unknown property "' + property + '"');
  } else if (this.nodes.indexOf(property) === -1) {
    throw new Error('Property "' + property + '" is not a node');
  }

  if (this._nodes[property] && !desc.array) {
    return this._nodes[property];
  }

  value = this.node[property];

  if (!value) {
    if (!desc.optional) {
      throw new Error('Missing property "' + this.type + '.' + property + '"');
    }
    return;
  }

  if (desc.array) {
    this._nodes[property] = this._nodes[property] || [];

    if (opt_idx >= 0) {
      value = value[opt_idx];

      if (!value) {
        throw new Error(
            'Invalid index "' + opt_idx + '" for property "' + property + '"');
      }
      // TODO: strict mode
      this._nodes[property][opt_idx] =
          new Node(this._walker, value, this, property, opt_idx);

      return this._nodes[property][opt_idx];

    } else {
      for (i = 0; i < value.length; ++i) {
        // TODO: strict mode
        if (!this._nodes[property][i]) {
          this._nodes[property][i] =
              new Node(this._walker, value[i], this, property, i);
        }
      }

      return this._nodes[property].slice();
    }
  } else {
    this._nodes[property] = new Node(this._walker, value, this, property);
    return this._nodes[property];
  }
};


Node.prototype.traverse = function() {
  var i, j;
  var property, desc, value, node;
  var walker = this._walker;
  var skip = walker.skipProperties;

  for (i = 0; i < this.nodes.length; ++i) {
    property = this.nodes[i];

    if (skip.indexOf(property) > -1) {
      continue;
    }

    desc = this._properties[property];
    value = this.node[property];

    if (!value) {
      if (!desc.optional) {
        throw new Error('Missing property "' + this.type + '.' + property + '"');
      }
      continue;
    }

    // TODO: strict validation

    if (desc.array) {
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
