/**
 * Merge two object.
 * @param {object} obj - The object that we must merge
 */
Object.prototype.merge = function (obj) {
  "use strict";
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (!this[key]) this[key] = [];
      this[key] = obj[key];
    }
  }
};
/**
 * Returns first element that meets the conditions of selector. Begins from itself and check each parent.
 * @param cssClass - css class type string
 * @returns {HTMLElement|*|boolean} returns DOM element or false if there is no such element
 */
Element.prototype.firstElementContains = function(cssClass){
  return this.classList.contains(cssClass) ?
    this : this.parentNode ?
      this.parentNode.firstElementContains(cssClass) : false;
};
/**
 * Wraps text with span with class 'highlighted'
 * @param stringToMark - text that needs to be highlighted
 * @returns {string}
 */
String.prototype.highLightText = function(stringToMark) {
  return stringToMark ?
    this.replace(new RegExp(stringToMark,'i'),'<span class="highlighted">'+ stringToMark + '</span>')
    : this;
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

/**
 * setting multiple attributes
 * @param attrs
 */
Element.prototype.setAttributes = function (attrs) {
  for (var key in attrs) {
    if (this.hasOwnProperty(key)) {
      this.setAttribute(key, attrs[key]);
    }
  }
};
