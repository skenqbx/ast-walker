'use strict';



function ClassName() {
  this.name = 'class';
}
module.exports = ClassName;


ClassName.prototype.test = function(arg1, arg2, arg3) {

  function next() {
  }

  switch (arg1) {
    case 1:
      return 1;
    case 2:
      return 2;
    default:
      return 3;
  }

  next();
};
