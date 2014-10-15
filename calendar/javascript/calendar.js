/*global document*/
/*jslint evil: true */

Object.prototype.merge = function (obj) {
    "use strict";
    var key;
    for (key in obj) {
        if (this.hasOwnProperty(key)) { this[key] = obj[key]; }
    }
};

var config = {
    year: (new Date()).getFullYear(),
    month: (new Date()).getMonth() + 1,
    firstDayOfWeek: "sunday",
    locale: "en"
};
var model = {chosenMonth: "", arrayOfDays: []};
var isPrint = false, time = 0;

function Calendar(properties) {
    "use strict";
    this.initialization(properties);
}

Calendar.prototype.loadFile = function (sURL, fCallback) {
    "use strict";
    var oReq = new XMLHttpRequest();
    oReq.callback = fCallback;
    oReq.arguments = Array.prototype.slice.call(arguments, 2);
    oReq.onload = xhrSuccess;
    oReq.onerror = xhrError;
    oReq.open("post", sURL, true);
    oReq.timeout = 0;
    oReq.send(null);
    isPrint = true;
};

Calendar.prototype.showCalendar = function () {
    "use strict";
    isPrint = false;
    var i, date = new Date(config.year, config.month - 1), month, dataMonth, weeks = [], monthPrefix,
        lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
        firstDayWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
        myMonth = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october",
            "november", "december"],
        myDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"], indexOfstartDay, days = [];

    model = {chosenMonth: "", arrayOfDays: []};

    dataMonth = JSON.parse(this.responseText);
    //----------------get the index of the start day--------------------------------------------
    indexOfstartDay = myDays.indexOf(config.firstDayOfWeek);

    //----------------send the chosen month to the model----------------------------------------
    model.chosenMonth = dataMonth.month[myMonth[config.month - 1]];

    //----------------create the right location of days of week and push it to the model--------
    for (i = 0; i < myDays.length; i += 1) { days[i] = dataMonth.daysOfWeek[myDays[i]]; }
    days = days.slice(indexOfstartDay, 7).concat(days.slice(0, indexOfstartDay));
    model.arrayOfDays.push(days);

    //----------------generate calendar---------------------------------------------------------
    month = Array.apply(null, {length: lastDay}).map(function (el, i) { return i + 1; });
    firstDayWeek = (7 - (indexOfstartDay + 1 - firstDayWeek)) % 7;
    monthPrefix = new Array(firstDayWeek);
    month = monthPrefix.concat(month);
    for (i = 0; i < month.length; i += 7) {
        model.arrayOfDays.push(month.slice(i, i + 7));
    }

    //---------------write the calendar to the window-------------------------------------------
    weeks.push("<br><br>" + model.chosenMonth + "\t\t" + config.year);
    for (i = 0; i < model.arrayOfDays.length; i += 1) {
        weeks.push(model.arrayOfDays[i].join("\t"));
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
        config.merge(properties);
        this.loadFile("localization/" + config.locale + ".json", this.showCalendar);
    }
};

function xhrSuccess() {
    "use strict";
    this.callback.apply(this, this.arguments);
}

function xhrError() {
    "use strict";
    console.error(this.statusText);
}