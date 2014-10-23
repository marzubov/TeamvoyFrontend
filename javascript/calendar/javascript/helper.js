Object.prototype.merge = function (obj) {
    var propName;
    for (propName in obj) {
        if (this.hasOwnProperty(propName)) {
            this[propName] = obj[propName];
        }
    }
};