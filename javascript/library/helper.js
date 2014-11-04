/**
 * Merge two object.
 * @param {object} obj - The object that we must merge
 */
Object.prototype.merge = function (obj) {
    "use strict";
    var key;
    for (key in obj) {
        if (this.hasOwnProperty(key)) {
            this[key] = obj[key];
        }
    }
};
/**
 * Inherits all properties from parent.
 * @param Parent - parent class that will be extended
 */
Function.prototype.extend = function(Parent) {
    var F = function () {};
    F.prototype = Parent.prototype;
    this.prototype = new F();
    this.prototype.constructor = this;
    this.superclass = Parent.prototype;
};

/**
 * Finds position of the element
 * @param elem
 * @returns {{top: number, left: number}}
 */
function findPos(elem) {
  var top=0, left=0;
  while(elem) {
    top = top + parseInt(elem.offsetTop);
    left = left + parseInt(elem.offsetLeft);
    elem = elem.offsetParent;
  }
  return {top: top, left: left};
}

/**
 * Short form of Array for each for calendar table
 * @param rows
 * @param func
 */
function rowsForEach(rows, func) {
  Array.prototype.slice.call(rows)
    .forEach(function (row) {
      Array.prototype.slice.call(row.cells)
        .forEach(function (cell) {
          func(cell);
        });
    });
}

/**
 * Short form of Array for each for calendar table
 * @param row
 * @param func
 */
function rowForEach(row, func) {
  Array.prototype.slice.call(row)
    .forEach(function (cell) {
      func(cell);
    });
}
