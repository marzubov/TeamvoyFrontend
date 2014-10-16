var Cache = {
    cache : {},
    keys : [],
    index : function (arr, obj) {
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if (arr[i] == obj) {
                return i;
            }
        }
        return - 1;
    },
    remove : function(key) {
        var t;
        if ((t = this.index(this.keys, key)) > -1) {
            this.keys.splice(t, 1);
            delete this.cache[key];
        }
    },
    removeAll : function() {
        this.cache = {};
        this.keys = [];
    },
    add : function(key, obj) {
        if (this.keys.indexOf(key) === -1) {
            this.keys.push(key);
        }
        console.log("add");
        this.cache[key] = obj;
        console.log(this.cache[key]);
        console.log(this.keys);
    },
    exists : function(key) {
        console.log("exist");
        return this.cache.hasOwnProperty(key);
    },
    get : function(key) {
        var val;
        if (this.cache[key] !== undefined) {
                val = this.cache[key];
        }
        console.log("get");
        return val;
    }
};
