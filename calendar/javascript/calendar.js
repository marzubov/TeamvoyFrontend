/*global document*/
/*jslint evil: true */
/*jslint latedef:false*/

Object.prototype.merge = function (obj) {
    var propName;
    for (propName in obj) {
        if (this.hasOwnProperty(propName)) { this[propName] = obj[propName]; }
    }
};

Calendar.localizationCache = {};
/**
 * Creates calendar and inserts it in container
 * @param container. Place in the DOM where calendar will be inserted
 * @param properties. Optional. Config object, has such fields like: year, month, firstDayOfWeek, locale, output
 * @constructor
 */
function Calendar(container,properties) {
    this.container=container;
    this.element={};
    this.model={};
    this.config = {
        year: (new Date()).getFullYear(),
        month: (new Date()).getMonth() + 1,
        firstDayOfWeek: "sunday",
        locale: "en",
        output: "text"
    };

    this.init(properties);
}
/**
 * First function called from constructor
 * @param properties
 */
Calendar.prototype.init = function (properties) {
    this.config.merge(properties);
    this.loadFile();

};
Calendar.prototype.reInit = function () {
    this.generateCalendar();
    this.generateTable();
};
/**
 * Checking if file is loaded in to cache
 */
Calendar.prototype.loadFile = function () {
    if(Calendar.localizationCache[this.config.locale]) {
        this.generateCalendar();
        this.generateTable();
        this.container.appendChild(this.element);
    }
        else {
            this.ajaxRequest();
        }
};
/**
 * Downloads localization file
 */
Calendar.prototype.ajaxRequest = function () {
    var currentCalendar=this;
    var oReq = new XMLHttpRequest();
    Calendar.localizationCache[currentCalendar.config.locale]=XMLHttpRequest;
    oReq.onload = function () {
        Calendar.localizationCache[currentCalendar.config.locale] = JSON.parse(this.responseText);
        currentCalendar.loadFile();
    };
    oReq.open("post","localization/" + currentCalendar.config.locale + ".json", false);
    oReq.send(null);
};
/**
 * Generates array with days depending on localization
 */
Calendar.prototype.generateCalendar = function () {
    var dataMonth=Calendar.localizationCache[this.config.locale];
    var i, date = new Date(this.config.year, this.config.month - 1), month, monthPrefix,
        lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
        firstDayWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
        myMonth = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october",
            "november", "december"],
        myDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"], indexOfstartDay, days = [];

    indexOfstartDay = myDays.indexOf(this.config.firstDayOfWeek);

    this.model.chosenMonth = dataMonth.month[myMonth[this.config.month - 1]];

    for (i = 0; i < myDays.length; i += 1) { days[i] = dataMonth.daysOfWeek[myDays[i]]; }
    this.model.arrayOfDays=[];
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
/**
 * Creates new table and insert it in container
 */
Calendar.prototype.generateTable = function(){
    var currentCalendar = this;
    if(currentCalendar.element.localName!='table'){
        currentCalendar.element =document.createElement('table');
    }
    var tableString='';

    //make header
    tableString+='<caption><button class="calendar-button desc"></button>'
        +(this.model.chosenMonth +' '+ this.config.year)
        +'<button class="calendar-button asc"></button></caption>';
    tableString+='<thead><tr><td>'+this.model.arrayOfDays[0].join('</td><td>')+'</td></tr></thead>';

    //make body
    tableString+='<tbody>';
    for (var i = 1; i < this.model.arrayOfDays.length; i++) {
        tableString+='<tr><td>'+(this.model.arrayOfDays[i].join("</td><td>"))+'</td></tr>';
    }
    tableString+='<tbody>';
    currentCalendar.element.innerHTML=tableString;

    // Set events
    var buttons=currentCalendar.element.querySelectorAll('button');
    buttons=Array.prototype.slice.call(buttons);
    buttons.forEach(function(el) {
        el.addEventListener('click',function(){
            currentCalendar.changeMonth(this);
        });
    });
    testMouseWheelHandle(currentCalendar,buttons)

};

function testMouseWheelHandle(calendar,buttons){
    // Testing mousewheel
    var isFocused;
    var temp=0;
    calendar.element.onmouseover=function(){
        isFocused=true;
    };
    calendar.element.onmouseout=function(){
        isFocused=false;
    };
    window.addEventListener("DOMMouseScroll", function(e){
        var direction = ((e.wheelDelta) ? e.wheelDelta/120 : e.detail/-3);
        if(direction>0 && isFocused){
            e.preventDefault();
            temp++;
            if(temp==5)
                calendar.changeMonth(buttons[0]);
        }
        else if(isFocused){
            e.preventDefault();
            temp++;
            if(temp==5)
                calendar.changeMonth(buttons[1]);
        }
    });
}
/**
 * Set new month depending on button clicked.
 * @param button The button that called function
 */
Calendar.prototype.changeMonth=function(button){
    if(button.classList.contains('asc')){
        this.config.month++;
        if(this.config.month>12){
            this.config.month=1;
            this.config.year++;
        }
    }
    else{
        this.config.month--;
        if(this.config.month<1){
            this.config.month=12;
            this.config.year--;
        }
    }
    this.reInit();
};