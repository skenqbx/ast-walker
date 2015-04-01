# ast-walker

**_AST traversal_**

```
Stability: 1 - Experimental
```

`ast-walker` provides event based _typed_ object tree traversal.
The default [configuration](./lib/types.json) is for an AST that follows the [ESTree spec](https://github.com/estree/estree/blob/master/spec.md), but other configurations can be provided.

## Usage

**Nothing works yet**

```js
var espree = require('espree');
var astWalker = require('ast-walker');

var ast = espree.parse(/* A JavaScript source string*/);
var walker = astWalker(ast);

walker.on('FunctionExpression', function(node) {
  if (node.parent.type === 'AssignmentExpression') {
    console.log(/* TODO: access "name" of parent.left */);
  } else {
    console.log('<anonymous>');
  }
});

walker.on('FunctionDeclaration', function(node) {
  console.log(node.type, node.get('id')); // TODO: use nodes with variable properties?!
});

walker.go();
```

### Compatible Parsers

 - [espree](https://github.com/eslint/espree)
  - support for `attachComment`, `range` & `loc` options
 - ...

## Tests

```bash
npm test
firefox coverage/lcov-report/index.html
```

### Coverage

```
Statements   : XX% ( YY/ZZ )
Branches     : XX% ( YY/ZZ )
Functions    : XX% ( YY/ZZ )
Lines        : XX% ( YY/ZZ )
```
