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
                dayEvents: [{
                    message:'Current day',
                    date: new Date()
                }]
            };
        this.container = container;
        this.rootElement = {};
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
                config.merge(value);
                reDraw();
            }
        });

        Calendar.localizationCache = {};

        //public methods

        /**
         * Copy calendar to another container
         * @param container {Object} - place where calendar will be inserted
         */
        this.insertElement = function (container) {
            container.appendChild(that.rootElement);
        };

        /**
         * Show current day in calendar
         */
        this.showToday = function () {
            var today = new Date();
            config.month = today.getMonth() + 1;
            config.year = today.getFullYear();
            reDraw();
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
            reDraw();
        };

        init(properties);
        //private methods

        function generateCalendar() {
            var dataMonth = Calendar.localizationCache[config.locale],
                i, date = new Date(config.year, config.month - 1), month, monthPrefix,
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
                td;
            //make caption
            tableString += '<caption><button class="calendar-button desc"></button><span>'
                + (model.chosenMonth + ' ' + config.year)
                + '</span><button class="calendar-button asc"></button></caption>';
            //make body
            tableString += '<tbody>';
            model.arrayOfDays.forEach(function (el) {
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
                if (e.target.classList.contains('calendar-button'))
                    e.target.classList.contains('asc') ?
                        that.nextMonth(1) : that.nextMonth(-1);
            });
        }

        function init(properties) {
            that.rootElement = document.createElement('table');
            config.merge(properties);
            if (Calendar.localizationCache[config.locale]) {
                that.insertElement(that.container);
            }
            else {
                ajaxRequest();
            }
        }

        function reDraw() {
            generateCalendar();
            renderTable();
        }
    };
})(window, document);