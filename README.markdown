# ast-walker

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

walker.on('postFunctionExpression', function(node) {
  if (node.parent.type === 'AssignmentExpression') {
    console.log(/* TODO: access "name" of parent.left */);
  } else {
    console.log('<anonymous>');
  }
});

walker.on('preFunctionDeclaration', function(node) {
  console.log(node.type, node.get('id')); // TODO: use nodes with variable properties?!
});

walker.go();
```

## Tests

[Espree](https://github.com/eslint/espree) is used for testing of AST traversal.


```bash
npm test
firefox coverage/lcov-report/index.html
```

### Coverage

```
Statements   : 93.55% ( 145/155 )
Branches     : 80.25% ( 65/81 )
Functions    : 88.89% ( 8/9 )
Lines        : 93.55% ( 145/155 )
```
