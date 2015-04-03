'use strict';
var astTypes = require('./types.json');



/**
 * Tree configuration backend
 *
 * @param {?Object} opt_options
 * @param {?Object} opt_types
 *
 * @constructor
 */
function Types(opt_options, opt_types) {
  opt_options = opt_options || {};

  this.strict = false;
  if (opt_options.strict) {
    this.strict = true;
  }

  this.unique = {};
  this.group = {};

  this.nonNodes = [];

  this._compile(opt_types || astTypes);
}
module.exports = Types;


Types.prototype.keys = function(type, opt_nodes) {
  var i, keys;
  var properties = this.unique[type];

  if (properties) {
    keys = Object.keys(properties);
    keys.splice(keys.indexOf('__group'), 1);

    if (opt_nodes) {
      for (i = 0; i < keys.length; ++i) {
        if (this.nonNodes.indexOf(properties[keys[i]].types[0]) > -1) {
          keys.splice(i, 1);
          --i;
        }
      }
    }
  }

  return keys;
};


Types.prototype._compile = function(types) {
  var i, j, k, keysP;
  var type, properties, property, value;
  var prefix, suffix;
  var isArray, isOptional, pos, list;
  var keysU = Object.keys(types.unique || {});
  var keysG = Object.keys(types.group || {});

  // process unique types
  for (i = 0; i < keysU.length; ++i) {
    type = keysU[i];
    properties = types.unique[type];
    keysP = Object.keys(properties);

    // console.log('#', type);
    this.unique[type] = {};

    // process properties
    for (j = 0; j < keysP.length; ++j) {
      property = keysP[j];
      list = undefined;

      // handle `['Type']`
      isArray = Array.isArray(properties[property]);
      if (isArray) {
        value = properties[property][0];
      } else {
        value = properties[property];
      }

      // handle `'?Type'`
      if (value[0] === '?') {
        isOptional = true;
        value = value.substr(1);
      } else {
        isOptional = false;
      }

      // handle `'TypeA|TypeB'`
      pos = value.indexOf('|');
      if (pos > 0) { // zero to prevent empty type names
        list = value.split('|');

        // check each possible type
        for (k = 0; k < list.length; ++k) {
          this.__isNode(list[k], types);
        }

        this.unique[type][property] = {
          array: isArray,
          optional: isOptional,
          types: list
        };

      // handle `'Type'`
      } else {
        this.__isNode(value, types);

        this.unique[type][property] = {
          array: isArray,
          optional: isOptional,
          types: [value]
        };
      }

      // console.log(' -', property, isOptional, isArray, list || value);

    } // properties end

    this.unique[type].__group = ['Node'];
  } // unique types end


  // process group types
  for (i = 0; i < keysG.length; ++i) {
    type = keysG[i];
    properties = types.group[type];
    list = undefined;

    if (properties.types) {
      list = properties.types.slice();

      // check each possible type
      for (j = 0; j < list.length; ++j) {
        if (!this.unique[list[j]]) { // the type has to exist
          throw new Error('Unknown group type "' + type + '.' + list[j] + '"');
        }

        this.unique[list[j]].__group.push(type);
      }
    }

    // collect types with simple prefix/suffix pattern
    if (properties.pattern) {
      list = list || [];
      prefix = undefined;
      suffix = undefined;

      if (properties.pattern.substr(-1) === '*') {
        prefix = properties.pattern.substr(0, properties.pattern.length - 1);
      } else if (properties.pattern[0] === '*') {
        suffix = properties.pattern.substr(1);
      }

      for (j = 0; j < keysU.length; ++j) {
        if (suffix && keysU[j].substr(suffix.length * -1) === suffix ||
            prefix && keysU[j].substr(0, prefix.length) === prefix) {
          this.unique[keysU[j]].__group.push(type);
          list.push(keysU[j]);
        }
      }
    }

    this.group[type] = list;
  } // group types end


  // post-process group parents
  for (i = 0; i < keysG.length; ++i) {
    type = keysG[i];
    property = types.group[type].parent;

    if (property) {
      if (!this.group[property]) {
        throw new Error(
            'Unknown group parent "' + type + ' > ' + property + '"');
      }
      this.group[property] =
          this.group[property].concat(this.group[type]);
    }
  }

  // console.log(JSON.stringify(this.unique, null, 2));
  // console.log(JSON.stringify(this.group, null, 2));
};


Types.prototype.__isNode = function(type, types) {
  if (!types.group[type] && !types.unique[type] &&
      this.nonNodes.indexOf(type) === -1) {
    this.nonNodes.push(type);
  }
};
