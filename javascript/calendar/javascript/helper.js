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

function rowsForEach(rows, func) {
    Array.prototype.slice.call(rows)
        .forEach(function (row) {
            Array.prototype.slice.call(row.cells)
                .forEach(function (cell) {
                    func(cell);
                });
        });
}

function rowForEach(row, func) {
    Array.prototype.slice.call(row)
        .forEach(function (cell) {
            func(cell);
        });
}