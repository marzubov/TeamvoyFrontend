Object.prototype.merge = function (obj) {
    var propName;
    for (propName in obj) {
        if (this.hasOwnProperty(propName)) {
            this[propName] = obj[propName];
        }
    }
};

function findPos(elem) {
    var top=0, left=0;
    while(elem) {
        top = top + parseInt(elem.offsetTop);
        left = left + parseInt(elem.offsetLeft);
        elem = elem.offsetParent;
    }
    return {top: top, left: left};
}

Function.prototype.extend = function(Parent) {
    var F = function () {};
    F.prototype = Parent.prototype;
    this.prototype = new F();
    this.prototype.constructor = this;
    this.superclass = Parent.prototype;
};