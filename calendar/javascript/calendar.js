/*global document*/
/*jslint evil: true */
/*jslint latedef:false*/

Object.prototype.merge = function (obj) {
    "use strict";
    var key;
    for (key in obj) {
        if (this.hasOwnProperty(key)) { this[key] = obj[key]; }
    }
    console.log("merge");
};

function Calendar(properties) {
    "use strict";
    this.config = {
        year: (new Date()).getFullYear(),
        month: (new Date()).getMonth() + 1,
        firstDayOfWeek: "sunday",
        locale: "en"
    };
    this.model = { chosenMonth: "", arrayOfDays: [] };
    console.log("start");
    this.initialization(properties);
}

Calendar.prototype.loadFile = function (sURL, fCallback, obj) {
    "use strict";
    console.log(obj.config.locale);
        var oReq = new XMLHttpRequest();
        console.log("load");
        oReq.onload = function () {
            if (Cache.exists(obj.config.locale)){
                obj.generateCalendar(obj, Cache.get(obj.config.locale));
                Queue.dequeue();
            } else {
                var dataMonth = JSON.parse(this.responseText);
                console.log("onload");
                Cache.add(obj.config.locale, dataMonth);
                fCallback(obj, dataMonth);
                Queue.dequeue();
                //obj.printCalendar();
            }
        };
        oReq.open("post", sURL, true);
        oReq.send(null);
};

Calendar.prototype.generateCalendar = function (obj, dataMonth) {
    "use strict";
    var i, date = new Date(obj.config.year, obj.config.month - 1), month, monthPrefix,
        lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
        firstDayWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
        myMonth = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october",
            "november", "december"],
        myDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"], indexOfstartDay, days = [];

    console.log("generate");
    //----------------get the index of the start day--------------------------------------------
    indexOfstartDay = myDays.indexOf(obj.config.firstDayOfWeek);

    //----------------send the chosen month to the model----------------------------------------
    obj.model.chosenMonth = dataMonth.month[myMonth[obj.config.month - 1]];

    //----------------create the right location of days of week and push it to the model--------
    for (i = 0; i < myDays.length; i += 1) { days[i] = dataMonth.daysOfWeek[myDays[i]]; }
    days = days.slice(indexOfstartDay, 7).concat(days.slice(0, indexOfstartDay));
    obj.model.arrayOfDays.push(days);

    //----------------generate calendar---------------------------------------------------------
    month = Array.apply(null, {length: lastDay}).map(function (el, i) { return i + 1; });
    firstDayWeek = (7 - (indexOfstartDay + 1 - firstDayWeek)) % 7;
    monthPrefix = new Array(firstDayWeek);
    month = monthPrefix.concat(month);
    for (i = 0; i < month.length; i += 7) {
        obj.model.arrayOfDays.push(month.slice(i, i + 7));
    }
    Queue.enqueue(obj);
};

Calendar.prototype.printCalendar = function () {
    "use strict";
    var weeks = [], i;
    console.log("print");
    weeks.push("<br><br>" + this.model.chosenMonth + "\t\t" + this.config.year);
    for (i = 0; i < this.model.arrayOfDays.length; i += 1) {
        weeks.push(this.model.arrayOfDays[i].join("\t"));
    }
    document.write("<pre>" + weeks.join("<br>") + "</pre>");
};

Calendar.prototype.initialization = function (properties) {
    "use strict";
    console.log("initialization");
    this.config.merge(properties);
    this.loadFile("localization/" + this.config.locale + ".json", this.generateCalendar, this);
};