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
    this._unique[type] = {};

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
          if (!this.__isType(list[k], types)) {
            throw new Error('Invalid property type "' +
                type + '.' + property + '.' + list[k] + '"');
          }
        }

        this._unique[type][property] = {
          array: isArray,
          optional: isOptional,
          types: list
        };

      // handle `'Type'`
      } else {
        if (!this.__isType(value, types)) {
          throw new Error('Invalid property type "' +
              type + '.' + property + '.' + value + '"');
        }

        this._unique[type][property] = {
          array: isArray,
          optional: isOptional,
          types: [value]
        };
      }

      // console.log(' -', property, isOptional, isArray, list || value);

    } // properties end
    // console.log();

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
        if (!this._unique[list[j]]) { // the type has to exist
          throw new Error('Unknown group type "' + type + '.' + list[j] + '"');
        }
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
          list.push(keysU[j]);
        }
      }
    }

    this._group[type] = list;

  } // group types end


  // post-process group parents
  for (i = 0; i < keysG.length; ++i) {
    type = keysG[i];
    property = types.group[type].parent;

    if (property) {
      if (!this._group[property]) {
        throw new Error(
            'Unknown group parent "' + type + ' > ' + property + '"');
      }
      this._group[property] =
          this._group[property].concat(this._group[type]);
    }
  }

  // console.log(JSON.stringify(this._unique, null, 2));
  // console.log(JSON.stringify(this._group, null, 2));
};


Types.prototype.__isType = function(type, types) {
  var nonNodes = ['boolean', 'string', 'null', 'object'];

  if (types.group[type] ||
      types.unique[type] ||
      nonNodes.indexOf(type) > -1) {

    return true;
  }

  return false;
};


Types.prototype.get = function(type) {
  return this._unique[type];
};


Types.prototype.getGroup = function(type) {
  return this._group[type];
};
