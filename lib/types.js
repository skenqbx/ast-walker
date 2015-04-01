'use strict';
// @see https://github.com/estree/estree/blob/master/spec.md
var astTypes = require('./types.json');



function Types(opt_types) {
  this._types = [];
  this._unique = {};
  this._group = {};

  this._compile(opt_types || astTypes);
}
module.exports = Types;


Types.prototype.keys = function(type) {
  if (this._unique[type]) {
    return Object.keys(this._unique[type]);
  }
};


Types.prototype._compile = function(types) {
  var i, j, group, prefix, suffix;
  var keysG, keysU = Object.keys(types.unique);

  for (i = 0; i < keysU.length; ++i) {
    this._unique[keysU[i]] = types.unique[keysU[i]];
    this._types.push(keysU[i]);
  }

  if (types.group) {
    keysG = Object.keys(types.group);

    for (i = 0; i < keysG.length; ++i) {
      group = types.group[keysG[i]];

      if (group.types) {
        this._group[keysG[i]] = group.types;
      } else {
        this._group[keysG[i]] = [];
      }

      if (group.pattern) {
        if (group.pattern[0] === '*') {
          suffix = group.pattern.substr(1);
        } else if (group.pattern.substr(-1) === '*') {
          prefix = group.pattern.substr(0, group.pattern.length - 1);
        }

        for (j = 0; j < keysU.length; ++j) {
          if (suffix && keysU[j].substr(suffix.length * -1) === suffix ||
              prefix && keysU[j].substr(0, prefix.length) === prefix) {
            this._group[keysG[i]].push(keysU[j]);
          }
        }
      }
    }

    for (i = 0; i < keysG.length; ++i) {
      group = types.group[keysG[i]];

      if (group.parent) {
        this._group[keysG[i]] = this._group[keysG[i]].concat(this._group[group.parent]);
      }
    }
  }
};


Types.prototype.get = function(type) {
  return this._unique[type];
};


Types.prototype.getGroup = function(type) {
  return this._group[type];
};
