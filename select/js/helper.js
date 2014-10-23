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