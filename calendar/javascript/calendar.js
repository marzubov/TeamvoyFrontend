/*global document*/
/*jslint evil: true */
/*jslint latedef:false*/

Object.prototype.merge = function (obj) {
    "use strict";
    var key;
    for (key in obj) {
        if (this.hasOwnProperty(key)) { this[key] = obj[key]; }
    }
};

Calendar.queue = [];
Calendar.countOfCreatedObject = 0;
Calendar.LocalizationCache = { data : {}, keys : [] };

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
};

Calendar.prototype.initialization = function (properties) {
    "use strict";
    this.config.merge(properties);
    Calendar.countOfCreatedObject += 1;
    this.loadFile("localization/" + this.config.locale + ".json", this.generateCalendar, this);
};

Calendar.prototype.loadFile = function (sURL, fCallback, obj) {
    "use strict";
        if (Calendar.LocalizationCache.keys.indexOf(obj.config.locale) !== -1){
            setTimeout(function () {
                if (Calendar.LocalizationCache.data.hasOwnProperty(obj.config.locale)){
                    obj.generateCalendar(obj, Calendar.LocalizationCache.data[obj.config.locale]);
                    if (Calendar.queue.length == Calendar.countOfCreatedObject) {
                        for (var i = 0; i< Calendar.countOfCreatedObject; i += 1) {
                            Calendar.queue.shift().printCalendar();
                        };
                    }
                } else {
                    this.AjaxRequest(sURL, fCallback, obj);
                }
            }, Calendar.countOfCreatedObject * 10);
        } else {
            this.AjaxRequest(sURL, fCallback, obj);
        };
};

Calendar.prototype.AjaxRequest = function (sURL, fCallback, obj) {
    var oReq = new XMLHttpRequest();
    Calendar.LocalizationCache.keys.push(obj.config.locale);
    oReq.onload = function () {
        var dataMonth = JSON.parse(this.responseText);
        Calendar.LocalizationCache.data[obj.config.locale] = dataMonth;
        fCallback(obj, dataMonth);
    }
    oReq.open("post", sURL, true);
    oReq.send(null);
}

Calendar.prototype.generateCalendar = function (obj, dataMonth) {
    "use strict";
    var i, date = new Date(obj.config.year, obj.config.month - 1), month, monthPrefix,
        lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
        firstDayWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
        myMonth = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october",
            "november", "december"],
        myDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"], indexOfstartDay, days = [];

    indexOfstartDay = myDays.indexOf(obj.config.firstDayOfWeek);

    obj.model.chosenMonth = dataMonth.month[myMonth[obj.config.month - 1]];

    for (i = 0; i < myDays.length; i += 1) { days[i] = dataMonth.daysOfWeek[myDays[i]]; }
    days = days.slice(indexOfstartDay, 7).concat(days.slice(0, indexOfstartDay));
    obj.model.arrayOfDays.push(days);

    month = Array.apply(null, {length: lastDay}).map(function (el, i) { return i + 1; });
    firstDayWeek = (7 - (indexOfstartDay + 1 - firstDayWeek)) % 7;
    monthPrefix = new Array(firstDayWeek);
    month = monthPrefix.concat(month);
    for (i = 0; i < month.length; i += 7) {
        obj.model.arrayOfDays.push(month.slice(i, i + 7));
    }
    Calendar.queue.push(obj);
};

Calendar.prototype.printCalendar = function () {
    "use strict";
    var weeks = [], i;
    weeks.push("<br><br>" + this.model.chosenMonth + "\t\t" + this.config.year);
    for (i = 0; i < this.model.arrayOfDays.length; i += 1) {
        weeks.push(this.model.arrayOfDays[i].join("\t"));
    }
    var container = document.createElement("div");
    container.innerHTML = ("<pre>" + weeks.join("<br>") + "</pre>");
    document.body.appendChild(container);
};