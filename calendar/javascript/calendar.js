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
Calendar.LocalizationCache = {};

function Calendar(properties) {
    "use strict";
    this.config = {
        year: (new Date()).getFullYear(),
        month: (new Date()).getMonth() + 1,
        firstDayOfWeek: "sunday",
        locale: "en",
        output: "text"
    };
    this.model = { chosenMonth: "", arrayOfDays: [] };
    this.init(properties);
}

Calendar.prototype.init = function (properties) {
    "use strict";
    Calendar.queue.push(this);
    this.config.merge(properties);
    this.loadFile();
};

Calendar.prototype.loadFile = function () {
    "use strict";
    if(Calendar.LocalizationCache[this.config.locale]) {
        if (Calendar.LocalizationCache[this.config.locale] != 'Loading') {
            while (true) {
                if (Calendar.queue.length>0 &&
                    Calendar.LocalizationCache[Calendar.queue[0].config.locale])
                     {
                    Calendar.queue[0].generateCalendar();
                    Calendar.queue[0].config.output == "table" ?
                        Calendar.queue.shift().printTable() :
                        Calendar.queue.shift().printCalendar();
                }
                else {
                    break;
                }
            }
        }
    }
        else {
            this.AjaxRequest();
        }
};

Calendar.prototype.AjaxRequest = function () {
    var currentCalendar=this;
    var oReq = new XMLHttpRequest();
    Calendar.LocalizationCache[currentCalendar.config.locale]='Loading';
    oReq.onload = function () {
        Calendar.LocalizationCache[currentCalendar.config.locale] = JSON.parse(this.responseText);
        currentCalendar.loadFile();
    };
    oReq.open("get","localization/" + currentCalendar.config.locale + ".json", true);
    oReq.send(null);
};

Calendar.prototype.generateCalendar = function () {
    var dataMonth=Calendar.LocalizationCache[this.config.locale];
    "use strict";
    var i, date = new Date(this.config.year, this.config.month - 1), month, monthPrefix,
        lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
        firstDayWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
        myMonth = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october",
            "november", "december"],
        myDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"], indexOfstartDay, days = [];

    indexOfstartDay = myDays.indexOf(this.config.firstDayOfWeek);

    this.model.chosenMonth = dataMonth.month[myMonth[this.config.month - 1]];

    for (i = 0; i < myDays.length; i += 1) { days[i] = dataMonth.daysOfWeek[myDays[i]]; }
    days = days.slice(indexOfstartDay, 7).concat(days.slice(0, indexOfstartDay));
    this.model.arrayOfDays.push(days);

    month = Array.apply(null, {length: lastDay}).map(function (el, i) { return i + 1; });
    firstDayWeek = (7 - (indexOfstartDay + 1 - firstDayWeek)) % 7;
    monthPrefix = new Array(firstDayWeek);
    month = monthPrefix.concat(month);
    for (i = 0; i < month.length; i += 7) {
        this.model.arrayOfDays.push(month.slice(i, i + 7));
    }

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

Calendar.prototype.printTable = function(){
    "use strict";
    var table=document.createElement('table');
    var tableString='';
    tableString+='<caption><button>-</button>'+(this.model.chosenMonth + this.config.year)+'<button>+</button></caption>';
    //make header
    tableString+='<thead><tr><td>'+this.model.arrayOfDays[0].join('</td><td>')+'</td></tr></thead>';
    //make body
    tableString+='<tbody>';
    for (var i = 1; i < this.model.arrayOfDays.length; i++) {
        tableString+='<tr><td>'+(this.model.arrayOfDays[i].join("</td><td>"))+'</td></tr>';
    }
    tableString+='<tbody>';
    table.innerHTML=tableString;
    document.body.appendChild(table);
};