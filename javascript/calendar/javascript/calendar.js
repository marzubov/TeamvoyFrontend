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
            firstDayOfWeek: "sunday",
            locale: "en"
        };
        this.container = container;
        this.rootElement={};
        //getter setter
        Object.defineProperty(this, "config", {
            get: function () {
                return config;
        },
            set : function(value){
                config.merge(value);
                that.reDraw();
            }
        });
        Calendar.localizationCache = {};

        //public methods
        /**
         * Generates new calendar. Config changes take effect
         */
        this.reDraw = function () {
            generateCalendar();
            renderTable();
        };
        /**
         * Add element to childs of container
         */
        this.insertElement = function(){
            container.appendChild(that.rootElement);
        };

        /**
         * Show current day in calendar
         */
        this.showToday = function () {
            var today = new Date();
            config.month = today.getMonth() + 1;
            config.year = today.getFullYear();
            this.reDraw();
        };

        /**
         * Set month to next or previous
         * @param direction. If direction>0 take next month else previous
         */
        this.nextMonth = function (direction) {
            if (direction > 0) {
                config.month++;
                if (config.month > 12) {
                    config.month = 1;
                    config.year++;
                }
            }
            else {
                config.month--;
                if (config.month < 1) {
                    config.month = 12;
                    config.year--;
                }
            }
            this.reDraw();
        };

        init(properties);
        //private methods

        function generateCalendar() {
            var dataMonth = Calendar.localizationCache[config.locale];
            var i, date = new Date(config.year, config.month - 1), month, monthPrefix,
                lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
                firstDayWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
                myMonth = ["january", "february", "march", "april", "may", "june",
                    "july", "august",
                    "september", "october",
                    "november", "december"],
                myDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
                indexOfStartDay, days = [];

            indexOfStartDay = myDays.indexOf(config.firstDayOfWeek);

            model.chosenMonth = dataMonth.month[myMonth[config.month - 1]];

            for (i = 0; i < myDays.length; i += 1) {
                days[i] = dataMonth.daysOfWeek[myDays[i]];
            }
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

        function renderTable() {
            that.rootElement.classList.add('calendar');
            var tableString = '',
                today = new Date(),
                isToday, td;
            if(today.getMonth()+1 == config.month && today.getFullYear() == config.year){
                isToday=true;
            }
            //make caption
            tableString += '<caption><button class="calendar-button desc"></button><span>'
                + (model.chosenMonth + ' ' + config.year)
                + '</span><button class="calendar-button asc"></button></caption>';
            //make body
            tableString += '<tbody>';
            model.arrayOfDays.forEach(function (el) {
                //mark current day
                if(isToday)
                el.forEach(function (day,i) {
                    el[i] = day == today.getDate() ? '<span class="calendar-today">'+day+'</span>' : day;
                });

                tableString += '<tr><td>' + (el.join("</td><td>")) + '</td></tr>';
            });
            tableString += '<tbody>';
            that.rootElement.innerHTML = tableString;
            setEvents();
        }

        function ajaxRequest() {
            var oReq = new XMLHttpRequest();
            Calendar.localizationCache[config.locale] = XMLHttpRequest;
            oReq.onload = function () {
                Calendar.localizationCache[config.locale] = JSON.parse(this.responseText);
                generateCalendar();
                renderTable();
                that.container.appendChild(that.rootElement);
            };
            oReq.open("post", "localization/" + config.locale + ".json", true);
            oReq.send(null);
        }

        function setEvents() {
            var tableCaption = that.rootElement.querySelector('caption');
            tableCaption.addEventListener('click', function (e) {
                console.log(e);
                if(e.target.localName == 'button')
                e.target.classList.contains('asc') ?
                        that.nextMonth(1) : that.nextMonth(-1);
                });
        }

        function init(properties) {
            that.rootElement=document.createElement('table');
            config.merge(properties);
            if (Calendar.localizationCache[config.locale]) {
                that.insertElement();
            }
            else {
                ajaxRequest();
            }

        }
    };
})(window, document);