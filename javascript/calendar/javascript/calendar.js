(function (window, document) {
    "use strict";
    /**
     * Creates calendar and inserts it in container
     * @param container - Place in the DOM where calendar will be inserted
     * @param properties - Optional. Config object, has such fields like: year, month, firstDayOfWeek, locale, output
     * @constructor
     */

    window.Calendar = function (container, properties) {
        var that = this,
            model = {},
            config = {
                year: (new Date()).getFullYear(),
                month: (new Date()).getMonth() + 1,
                firstDayOfWeek: 'sunday',
                locale: 'en',
                dayEvents: [
                    {
                        message: 'Current day',
                        date: new Date()
                    }
                ]
            };
        Calendar.localizationCache = {};
        this.container = container;
        this.rootElement = {};
        this.infoContainer = {};
        this.dayInfo = {};
        init();

        //getter setter
        Object.defineProperty(this, "config", {
            get: function () {
                return config;
            },
            set: function (value) {
                var propName;
                for (propName in value) {
                    value[propName] = value[propName] ?
                        value[propName] :
                        config[propName];
                }
                if (value['month'] != config['month']) {
                    that.trigger('onMonthChanged');
                }
                config.merge(value);
                render();
            }
        });

        /**
         * Show current day in calendar
         */
        this.showToday = function () {
            var today = new Date();
            config.month = today.getMonth() + 1;
            config.year = today.getFullYear();
            render();
        };

        function generateCalendar() {
            var dataMonth = Calendar.localizationCache[config.locale],
                i, date = new Date(config.year, config.month - 1), month, monthPrefix,
                lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
                firstDayWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
                myMonth = ["january", "february", "march", "april", "may", "june", "july", "august",
                    "september", "october", "november", "december"],
                myDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
                indexOfStartDay, days = [];
            indexOfStartDay = myDays.indexOf(config.firstDayOfWeek);
            model.chosenMonth = dataMonth.month[myMonth[config.month - 1]];
            myDays.forEach(function (el, i) {
                days[i] = dataMonth.daysOfWeek[el];
            });
            model.arrayOfDays = [];
            days = days.slice(indexOfStartDay, 7).concat(days.slice(0, indexOfStartDay));
            model.arrayOfDays.push(days);
            month = Array.apply(null, {length: lastDay}).map(function (el, i) {
                return i + 1;
            });
            firstDayWeek = (7 - (indexOfStartDay + 1 - firstDayWeek)) % 7;
            monthPrefix = new Array(firstDayWeek);
            month = monthPrefix.concat(month);
            for (i = 0; i < month.length; i += 7) {
                model.arrayOfDays.push(month.slice(i, i + 7));
            }
        }

        function markDayEvents() {
            config.dayEvents.forEach(function (dEvent) {
                if (dEvent.date.getFullYear() === config.year &&
                    dEvent.date.getMonth() + 1 === config.month) {
                    Array.prototype.slice.call(that.rootElement.rows)
                        .forEach(function (row) {
                            //console.log(row);
                            Array.prototype.slice.call(row.cells)
                                .forEach(function (cell) {
                                    if ((cell.innerHTML == dEvent.date.getDate().toString()) && (cell.classList.contains('active-day'))) {
                                        cell.classList.add('super-active');
                                    }
                                });
                        });
                }
            })
        }

        function renderTable() {
            that.rootElement.classList.add('calendar');
            var tableString = '';

            //make caption
            tableString += '<caption class="caption"><button class="calendar-button desc"></button><span>'
                + (model.chosenMonth + ' ' + config.year)
                + '</span><button class="calendar-button asc"></button></caption>';

            //make body
            tableString += '<tbody>';
            tableString += renderDays();
            tableString += '<tbody>';
            that.rootElement.innerHTML = tableString;
        }

        function renderDays(){
            var tableString = '';
            var k = 0, date = new Date(config.year, config.month - 2), td,
                lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
                firstDayWeek = new Date(date.getFullYear(), date.getMonth() + 1, 1).getDay(),
                firstWeekendDay = 0, secondWeekendDay = 6;
            if (config.locale == 'en') {
                firstDayWeek -= 1;
            }
            else {
                firstDayWeek -= 2;
            }
            model.arrayOfDays.forEach(function (el) {

                //rendering day rows
                switch (k){
                    case 0: {

                        //row with week names
                        tableString+='<tr>';
                        for (var i = 0; i < 7; i++){
                            if (config.locale == 'en'){
                                if(i == firstWeekendDay) {
                                    tableString+='<td class="day-name weekend">' + el[i] + '</td>';
                                }else if(i == secondWeekendDay){
                                    tableString+='<td class="day-name weekend">' + el[i] + '</td>';
                                }else {
                                    tableString+='<td class="day-name">' + el[i] + '</td>';
                                }
                            }
                        }
                        tableString+='</tr>';
                        k++;
                        break;
                    }
                    case 1:{

                        //1st month days row with possible non active days + checking for day events
                        tableString+='<tr>';
                        for (var i = 0; i < 7; i++){
                            if (config.locale == 'en'){

                                    if (i == firstWeekendDay) {
                                        if (el[i]) {
                                            tableString += '<td class="active-day weekend">' + el[i] + '</td>';
                                        }
                                        else{
                                            tableString += '<td class="non-active-day weekend">' + (lastDay - firstDayWeek).toString() + '</td>';
                                            firstDayWeek--;
                                        }

                                    } else if (i == secondWeekendDay) {
                                        tableString += '<td class="active-day weekend">' + el[i] + '</td>';
                                    } else {

                                        if (el[i]) {
                                            tableString += '<td class="active-day">' + el[i] + '</td>';
                                        }
                                        else{
                                            tableString += '<td class="non-active-day">' + (lastDay - firstDayWeek).toString() + '</td>';
                                            firstDayWeek--;
                                        }
                                    }
                                }
                        }
                        tableString+='</tr>';
                        k++;
                        break;
                    }
                    default:{

                        //rows with all active days + checking for day events
                        tableString+='<tr>';
                        for (var i = 0; i < 7; i++){
                            if (config.locale == 'en'){
                                if(el[i]) {
                                    if (i == firstWeekendDay) {
                                        tableString += '<td class="active-day weekend">' + el[i] + '</td>';
                                    } else if (i == secondWeekendDay) {
                                        tableString += '<td class="active-day weekend">' + el[i] + '</td>';
                                    } else {
                                        tableString += '<td class="active-day">' + el[i] + '</td>';
                                    }
                                }
                                else{
                                    //tableString += '<td></td>';
                                }
                            }
                        }
                        tableString+='</tr>';
                        k++;
                        break;
                    }
                }
            });
            return tableString;
        }

        function renderEndOfTheMonth() {
            var td,rowLength;
            rowLength = that.rootElement.rows[that.rootElement.rows.length - 1].cells.length.valueOf();
            var i;
            for (i = 0; i < 7 - rowLength; i++) {
                td = document.createElement('td');
                td.classList.add("non-active-day");
                if (i+1 == 7 - rowLength){
                    td.classList.add("weekend");
                }
                td.innerHTML = (i + 1).toString();
                that.rootElement.rows[that.rootElement.rows.length - 1].appendChild(td);
            }

            var k = 0;

            while (that.rootElement.rows.length < 7) {
                i++;
                var newRow = document.createElement('tr');
                for (var j = 0; j < 7; j++) {
                    if ((j == 0) || (j ==6)){
                        newRow.innerHTML += '<td class="non-active-day weekend">' + i.toString() + '</td>';
                    }else{
                        newRow.innerHTML += '<td class="non-active-day">' + i.toString() + '</td>';
                    }
                    i++;
                }
                that.rootElement.childNodes[1].appendChild(newRow);
                k++;
            }
        }

        function renderInfoContainer() {
            that.infoContainer.classList.add('info-container');
            that.dayInfo.innerHTML = " Her goes clicked day information";
            return that.infoContainer;
        }

        function showDayInfo(e) {
            if (e.target != this) {
                if (e.target.classList.contains('active-day')) {
                    var currentPosition = findPos(e.target), currentDayEvent;
                    that.infoContainer.classList.add('info-container-active');
                    that.infoContainer.style.left = (currentPosition.left + e.target.offsetWidth).toString() + 'px';
                    that.infoContainer.style.top = (currentPosition.top + e.target.offsetHeight).toString() + 'px';
                    config.dayEvents.forEach(function (dEvent) {
                        if (dEvent.date.getFullYear() === config.year &&
                            dEvent.date.getMonth() + 1 === config.month) {
                            if (e.target.innerHTML == dEvent.date.getDate().toString()) {
                                currentDayEvent = dEvent.message;
                            }
                        }
                    });
                    that.dayInfo.innerHTML = "Day info: <br/>" + e.target.innerHTML + '.' + that.config.month + '.' + that.config.year;
                    if (currentDayEvent) {
                        that.dayInfo.innerHTML += '<br/>Day event:' + '<br/>' + currentDayEvent.toString();
                    }
                    return true;
                }
                return false;
            }
            else {
                return false;
            }
        }

        function createCloseButton() {
            var closeButton = document.createElement('div');
            closeButton.innerHTML = '<button type="button" class="close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
            closeButton.childNodes[0].addEventListener('click', closeInfoContainer);
            closeButton.childNodes[0].classList.add('close-button');
            return closeButton.childNodes[0];
        }

        function closeInfoContainer() {
            that.infoContainer.classList.remove('info-container-active');
        }

        function ajaxRequest() {
            var oReq = new XMLHttpRequest();
            Calendar.localizationCache[config.locale] = XMLHttpRequest;
            oReq.open("post", "localization/" + config.locale + ".json", true);
            oReq.send(null);
            return oReq;
        }

        function setEvents() {
            that.rootElement
                .addEventListener('click', function (e) {
                    if (e.target.classList.contains('calendar-button')) {
                        e.target.classList.contains('asc') ? config.month++ : config.month--;
                        if (config.month > 12) {
                            config.year++;
                            config.month = 1;
                        }
                        else if (config.month < 1) {
                            config.year--;
                            config.month = 12;
                        }
                        that.trigger('onMonthChanged');
                        render();
                    }
                });


            Array.prototype.slice.call(that.rootElement.querySelectorAll('.calendar-event'))
                .forEach(function (el) {
                    el.addEventListener('mouseover', function () {
                        console.log(el.dataset.message);
                    })
                })
        }

        function render() {
            generateCalendar();
            renderTable();
            renderEndOfTheMonth();
            markDayEvents();
            that.infoContainer = renderInfoContainer();
            that.rootElement.addEventListener('click', showDayInfo);
        }

        function init() {
            that.rootElement = document.createElement('table');

            that.infoContainer = document.createElement('div');
            that.dayInfo = document.createElement('span');

            that.infoContainer.appendChild(that.dayInfo);
            that.infoContainer.appendChild(createCloseButton());
            document.body.appendChild(that.infoContainer);
            config.merge(properties);
            if (!Calendar.localizationCache[config.locale]) {
                ajaxRequest()
                    .onload = function () {
                    Calendar.localizationCache[config.locale] = JSON.parse(this.responseText);
                    render();
                    container.appendChild(that.rootElement);
                };
            }
            setEvents();
        }


    };
    Calendar.prototype = new EventMachine();
})(window, document);