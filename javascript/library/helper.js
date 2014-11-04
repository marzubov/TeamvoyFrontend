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
 * Returns first element that meets the conditions of selector. Begins from itself and check each parent.
 * @param cssSelector - css selector type string
 * @returns {HTMLElement|*|boolean} returns DOM element or false if there is no such element
 */
Element.prototype.firstContainsSelector = function(cssSelector){
  return this.querySelector(cssSelector) || this.parent.firstContainsSelector(cssSelector) || false;
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
