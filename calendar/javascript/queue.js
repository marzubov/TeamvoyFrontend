var Queue = {
    queueOfObjects: [],
    enqueue : function (obj) {
        "use strict";
        this.queueOfObjects.push(obj);
        console.log(this.queueOfObjects);
    },
    dequeue: function () {
        "use strict";
        var delObj = this.queueOfObjects.shift();
        delObj.printCalendar();
        return delObj;
    }
};
