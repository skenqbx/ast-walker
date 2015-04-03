# ast-walker [![Build Status](https://secure.travis-ci.org/skenqbx/ast-walker.png)](http://travis-ci.org/skenqbx/ast-walker)

**_Typed Object Traversal_**

```
Stability: 1 - Experimental
```

`ast-walker` provides _typed object_ tree traversal.
The default [configuration](./lib/types.json) is for an AST that follows the [ESTree ES5 spec](https://github.com/estree/estree/blob/master/spec.md), but other configurations can be provided.

## Usage

```js
var espree = require('espree');
var Walker = require('ast-walker');

var ast = espree.parse(/* A JavaScript source string*/);
var walker = new Walker(ast, {
  skipProperties: ['cases'] // don't traverse *.cases
});

walker.on('post-FunctionExpression', function(node) {
  if (node.parent.type === 'AssignmentExpression') {
    console.log(/* TODO: access "name" of parent.left */);
  } else {
    console.log('<anonymous>');
  }
});

// emitted for every Node
walker.on('pre-group-Node', function(node) {

});

// emitted for *Statement & *Declaration
walker.on('pre-group-Statement', function(node) {

});

walker.traverse();
```

## Tests

[Espree](https://github.com/eslint/espree) is used for testing of AST traversal.


```bash
npm test
firefox coverage/lcov-report/index.html
```

### Coverage

```
Statements   : 90.82% ( 188/207 )
Branches     : 80.34% ( 94/117 )
Functions    : 100%   ( 11/11 )
Lines        : 90.82% ( 188/207 )
```
