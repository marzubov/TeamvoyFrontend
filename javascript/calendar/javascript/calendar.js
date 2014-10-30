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
            root,
            config = {
                year: (new Date()).getFullYear(),
                month: (new Date()).getMonth() + 1,
                firstDayOfWeek: 'sunday',
                locale: 'en',
                dayEvents: [
                    {
                        28: {message: 'Current day',
                            date: new Date()
                        }
                    },
                    {
                        29: {message: 'Current day',
                            date: new Date()
                        }
                    }
                ]
            };
        Calendar.localizationCache = {};
        this.container = container;
        init();

        /**
         * Show current day in calendar
         */
        this.showToday = function () {
            var today = new Date();
            config.month = today.getMonth() + 1;
            config.year = today.getFullYear();
            render();
            that.customizeToday(today);
            that.trigger('onDayChanged');
            return today;
        };

        /**
         * Generating calendar
         */
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

        /**
         * Getting day event
         * @param day
         * @returns {*}
         */
        this.getDayEvent = function (day) {
            var _dayEvents = {};
            Array.prototype.slice.call(config.dayEvents)
                .forEach(function (dayEvent) {
                    if (dayEvent[day]){
                        _dayEvents = dayEvent[day];
                    }
                });
            return _dayEvents;
        };

        /**
         *
         * @returns {element}
         */
        this.getRoot = function (){
            return root;
        };

        /**
         * rendering table
         */
        function renderTable() {
            root.classList.add('calendar');
            var tableString = '', i = 0, newMonthDay = 1,
                date = new Date(config.year, config.month - 2),
                lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
                firstDayWeek = new Date(date.getFullYear(), date.getMonth() + 1, 1).getDay();

            //make caption
            tableString += '<caption class="caption"><button class="calendar-button desc"></button><span>'
                + (model.chosenMonth + ' ' + config.year)
                + '</span><button class="calendar-button asc"></button></caption>';

            //make body
            tableString += '<tbody>';
            var weekNumber = 0;
            model.arrayOfDays.forEach(function (week) {
                tableString += '<tr>';

                for (i = 0; i < 7; i++) {
                    if (week[i]) {
                        tableString += '<td dayNumber = '+week[i].toString()+'>' + week[i].toString() + '</td>';
                    } else if (weekNumber == 1) {//previous month non active days
                        tableString += '<td class="non-active-day">' + (lastDay - firstDayWeek).toString() + '</td>';
                        firstDayWeek--;
                    } else {//next month non active days
                        tableString += '<td class="non-active-day">' + newMonthDay.toString() + '</td>';
                        newMonthDay++;
                    }
                }
                tableString += '</tr>';
                weekNumber++;
            });

            //adding additional non active week to feet standard calendar length
            tableString += nextMonthDays(newMonthDay);

            tableString += '</tbody>';
            root.innerHTML = tableString;
        }

        /**
         * Next month days for rendering additional week
         * @param startDay - start day for new week
         * @returns {string} - days of new week of next month
         */
        function nextMonthDays(startDay) {
            //adding next month week if calendar doesn't  feet standard length
            var newRow = '';
            for (var j = 0; j < 7 - model.arrayOfDays.length; j++) {
                newRow += '<tr>';
                for (var i = 1; i <= 7; i++) {
                    newRow += '<td class="non-active-day">' + (i + startDay).toString() + '</td>';
                }
                newRow += '</tr>';
            }
            return newRow
        }

        /**
         * Ajax request to get localization
         * @returns {XMLHttpRequest}
         */
        function getLocalization() {
            var xhr = new XMLHttpRequest();
            Calendar.localizationCache[config.locale] = XMLHttpRequest;
            xhr.open("post", "localization/" + config.locale + ".json", true);
            xhr.send(null);
            return xhr;
        }

        /**
         * setting events on table
         */
        function setEvents() {
            root
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
                        that.trigger('onMonthChanged', [e]);
                        render();
                        return true;
                    }
                    else if (e.target != this) {
                        that.trigger('onDayChanged', [e]);
                        return true;
                    }
                    return false;
                });
        }

        /**
         * rendering
         */
        function render() {
            generateCalendar();
            renderTable();
            that.CustomizeCalendar(that);
            if (config.locale == 'en') {
                that.customizeWeekends(0,6);
            } else {
                that.customizeWeekends(5,6);
            }
            var today = new Date();
            if ((today.getMonth()+1 == config.month)&& (today.getFullYear() == config.year)) {
                that.customizeToday(new Date());
            }
        }

        /**
         * initialize
         */
        function init() {
            root = document.createElement('table');

            Object.defineProperty(that, "config", {
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

            config.merge(properties);
            if (!Calendar.localizationCache[config.locale]) {
                getLocalization()
                    .onload = function () {
                    Calendar.localizationCache[config.locale] = JSON.parse(this.responseText);
                    render();
                    container.appendChild(root);
                };
            }
            setEvents();
        }
    };
    Calendar.prototype = new EventMachine();
})(window, document);