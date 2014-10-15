/*global document*/
/*jslint evil: true */

Object.prototype.merge = function (obj) {
    "use strict";
    var key;
    for (key in obj) {
        if (this.hasOwnProperty(key)) { this[key] = obj[key]; }
    }
};

var isPrint = false, time = 0;

function Calendar(properties) {
    "use strict";
    this.config = {
        year: (new Date()).getFullYear(),
        month: (new Date()).getMonth() + 1,
        firstDayOfWeek: "sunday",
        locale: "en"
    };
    this.model = { chosenMonth: "", arrayOfDays: [] };
    this.initialization(properties);
}

Calendar.prototype.loadFile = function (sURL, fCallback, obj) {
    "use strict";
    var oReq = new XMLHttpRequest();
    oReq.onload = function () {
        var dataMonth = JSON.parse(this.responseText);
        fCallback(obj, dataMonth);
        obj.printCalendar();
    };
    oReq.open("post", sURL, true);
    oReq.send(null);
    isPrint = true;
};

Calendar.prototype.generateCalendar = function (obj, dataMonth) {
    "use strict";
    isPrint = false;
    var i, date = new Date(obj.config.year, obj.config.month - 1), month, monthPrefix,
        lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
        firstDayWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
        myMonth = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october",
            "november", "december"],
        myDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"], indexOfstartDay, days = [];


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
};

Calendar.prototype.printCalendar = function () {
    "use strict";
    var weeks = [], i;
    weeks.push("<br><br>" + this.model.chosenMonth + "\t\t" + this.config.year);
    for (i = 0; i < this.model.arrayOfDays.length; i += 1) {
        weeks.push(this.model.arrayOfDays[i].join("\t"));
    }
    document.write("<pre>" + weeks.join("<br>") + "</pre>");
};

Calendar.prototype.initialization = function (properties) {
    "use strict";
    time += 1;
    if (isPrint) {
        setTimeout(function () {
            isPrint = false;
            new Calendar(properties);
        }, time *  20);
    } else {
        this.config.merge(properties);
        this.loadFile("localization/" + this.config.locale + ".json", this.generateCalendar, this);
    }
};