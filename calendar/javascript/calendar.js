(function(window,document) {
    "use strict";
/**
 * Creates calendar and inserts it in container
 * @param container. Place in the DOM where calendar will be inserted
 * @param properties. Optional. Config object, has such fields like: year, month, firstDayOfWeek, locale, output
 * @constructor
 */
window.Calendar = function(container, properties) {
    var that=this;
    this.container = container;
    this.rootElement= undefined;
    this.model = {};
    this.config = {
        year: (new Date()).getFullYear(),
        month: (new Date()).getMonth() + 1,
        firstDayOfWeek: "sunday",
        locale: "en",
        output: "text"
    };

    this.init(properties);
};
    function setEvents(calendar) {
        var buttons = calendar.rootElement.querySelectorAll('button');
        buttons = Array.prototype.slice.call(buttons);
        buttons.forEach(function (el) {
            el.addEventListener('click', function () {
                this.classList.contains('asc')?
                calendar.nextMonth(1):calendar.nextMonth(0);
            });
        });
        var isFocused;
        var temp = 0;
        calendar.rootElement.onmouseover = function () {
            isFocused = true;
        };
        calendar.rootElement.onmouseout = function () {
            isFocused = false;
        };
        window.addEventListener("DOMMouseScroll", function (e) {
            var direction = ((e.wheelDelta) ? e.wheelDelta / 120 : e.detail / -3);
            if (isFocused) {
                e.preventDefault();
                temp++;
                if (temp == 5)
                // Up scroll signed with -
                    calendar.nextMonth(0-direction);
            }
        });
    }
Calendar.localizationCache = {};
/**
 * First function called from constructor
 * @param properties
 */
Calendar.prototype.init = function (properties) {
    this.config.merge(properties);
    this.loadLocalization();
};

Calendar.prototype.reDraw = function () {
    this.generateCalendar();
    this.renderTable();
};

/**
 * Checking if file is loaded in to cache
 */
Calendar.prototype.loadLocalization = function () {
    var that=this;
    if (Calendar.localizationCache[that.config.locale]) {
        that.generateCalendar();
        that.renderTable();
        that.container.appendChild(that.rootElement);
    }
    else {
        ajaxRequest(that);
    }
};
    function ajaxRequest (that) {
        var oReq = new XMLHttpRequest();
        Calendar.localizationCache[that.config.locale] = XMLHttpRequest;
        oReq.onload = function () {
            Calendar.localizationCache[that.config.locale] = JSON.parse(this.responseText);
            that.loadLocalization();
        };
        oReq.open("post", "localization/" + that.config.locale + ".json", false);
        oReq.send(null);
    }
/**
 * Downloads localization file
 */


/**
 * Generates array with days depending on localization
 */
Calendar.prototype.generateCalendar = function () {
    var dataMonth = Calendar.localizationCache[this.config.locale];
    var i, date = new Date(this.config.year, this.config.month - 1), month, monthPrefix,
        lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
        firstDayWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
        myMonth = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october",
            "november", "december"],
        myDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"], indexOfstartDay, days = [];

    indexOfstartDay = myDays.indexOf(this.config.firstDayOfWeek);

    this.model.chosenMonth = dataMonth.month[myMonth[this.config.month - 1]];

    for (i = 0; i < myDays.length; i += 1) {
        days[i] = dataMonth.daysOfWeek[myDays[i]];
    }
    this.model.arrayOfDays = [];
    days = days.slice(indexOfstartDay, 7).concat(days.slice(0, indexOfstartDay));
    this.model.arrayOfDays.push(days);

    month = Array.apply(null, {length: lastDay}).map(function (el, i) {
        return i + 1;
    });
    firstDayWeek = (7 - (indexOfstartDay + 1 - firstDayWeek)) % 7;
    monthPrefix = new Array(firstDayWeek);
    month = monthPrefix.concat(month);

    for (i = 0; i < month.length; i += 7) {
        this.model.arrayOfDays.push(month.slice(i, i + 7));
    }

};

/**
 * Creates new table and insert it in container
 */
Calendar.prototype.renderTable = function () {
    var that = this;
    if(!that.rootElement)
        that.rootElement = document.createElement('table');
    that.rootElement.classList.add('calendar');
    var tableString = '';
    //make caption
    tableString += '<caption><button class="calendar-button desc"></button>'
        + (this.model.chosenMonth + ' ' + this.config.year)
        + '<button class="calendar-button asc"></button></caption>';
    //make body
    tableString += '<tbody>';
    this.model.arrayOfDays.forEach(function(el){
        tableString += '<tr><td>' + (el.join("</td><td>")) + '</td></tr>';
    });
    tableString += '<tbody>';
    that.rootElement.innerHTML = tableString;
    setEvents(that);
};


/**
 * Set new month depending on button clicked.
 * @param direction If this>0 take next month
 */
Calendar.prototype.nextMonth = function (direction) {
    if (direction>0) {
        this.config.month++;
        if (this.config.month > 12) {
            this.config.month = 1;
            this.config.year++;
        }
    }
    else {
        this.config.month--;
        if (this.config.month < 1) {
            this.config.month = 12;
            this.config.year--;
        }
    }
    this.reDraw();
};
})(window,document);