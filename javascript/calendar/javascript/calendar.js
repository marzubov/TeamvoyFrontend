(function (global, document) {
    "use strict";
    /**
     * Creates calendar and inserts it in container
     * @param container - Place in the DOM where calendar will be inserted
     * @param properties - Optional. Config object, has such fields like: year, month, firstDayOfWeek, locale, output
     * @constructor
     */

    var Calendar = global.Calendar = function (container, properties) {
        Calendar.superclass.constructor.call(this);
        var calendar, root,
            that = this,
            model = {},
            config = {
                year: (new Date()).getFullYear(),
                month: (new Date()).getMonth() + 1,
                firstDayOfWeek: 'SUN',
                locale: 'en',
                style: 'default',
                daysInWeek: 7,
                dayEvents: [],
                weekends: ['SAT', 'SUN']
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

        function generateCalendar() {
            var i, date = new Date(config.year, config.month - 1), month, monthPrefix,
                lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
                firstDayWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
                indexOfStartDay, days = [],
                maxDaysNumber = (1 + parseFloat(Math.ceil(30 / config.daysInWeek))) * config.daysInWeek,
                myMonth = Object.keys(Calendar.localizationCache[config.locale].month).map(function (key, index) {
                    return Calendar.localizationCache[config.locale].month[key];
                }),
                myDays = Object.keys(Calendar.localizationCache[config.locale].daysOfWeek).map(function (key, index) {
                    return Calendar.localizationCache[config.locale].daysOfWeek[key];
                });

            indexOfStartDay = myDays.indexOf(config.firstDayOfWeek);
            model.chosenMonth = myMonth[config.month - 1];

            myDays.forEach(function (el, i) {
                days[i] = el;
            });

            model.arrayOfDays = [];
            days = days.slice(indexOfStartDay, config.daysInWeek).concat(days.slice(0, indexOfStartDay));
            model.arrayOfDays.push(days);

            month = Array.apply(null, {length: lastDay}).map(function (el, i) {
                return i + 1;
            });

            firstDayWeek = (config.daysInWeek - (indexOfStartDay + 1 - firstDayWeek)) % config.daysInWeek;
            monthPrefix = new Array(firstDayWeek);
            month = monthPrefix.concat(month);
            month = month.concat(new Array(maxDaysNumber - month.length));

            for (i = 0; i < month.length; i += config.daysInWeek) {
                model.arrayOfDays.push(month.slice(i, i + config.daysInWeek));
            }
            return this;
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
                    if (dayEvent[day]) {
                        _dayEvents = dayEvent[day];
                    }
                });
            return _dayEvents;
        };

        /**
         *
         * @returns {Element}
         */
        this.getRoot = function () {
            return root;
        };

        /**
         *  Renders headings and returns string of rendered element
         * @returns {string}
         */
        /**
         *  Customizing days styles
         */
        this.customizeDays = function () {
            var ifFirstRow = true;
            rowsForEach(calendar.getRoot().rows, function (cell) {
                if (!ifFirstRow) {
                    // its just day names, so we are skipping this iteration
                    ifFirstRow = false;
                } else {
                    //here customizing days
                    //checking if day isn't from another month
                    if (!cell.classList.contains('non-active-day')) {
                        cell.classList.add('active-day');
                    }
                }
            });
            return this;
        };

        /**
         *  Customizing days names style
         */
        this.customizeDayNames = function (header) {
            header = header || calendar.getRoot().rows[0];
            rowForEach(header.cells, function (dayName) {
                dayName.classList.add('day-name');
            });
            return this;
        };

        this.customizeWeekends = function (weekends, daysInWeek) {
            var weekNumber = 0;
            var dayNumber = 0;
            rowsForEach(calendar.getRoot().rows, function (cell) {
                weekNumber = Math.floor(dayNumber / 7);
                //calendar.getRoot().rows[0] - header row
                //.cells[dayNumber] - array of td
                //.getAttribute('dayName')) - dayName attribute for comparison
                if (weekends.indexOf(calendar.getRoot().rows[0]
                        .cells[dayNumber]
                        .getAttribute('dayName')) != -1) {
                    cell.classList.add('weekend');
                }
                dayNumber++;
                if (dayNumber == daysInWeek) dayNumber = 0;
            });
            return this;
        };

        this.customizeToday = function (today) {
            rowsForEach(calendar.getRoot().rows, function (cell) {
                if (today.getDate() == cell.getAttribute('dayNumber')) {
                    cell.classList.add('today');
                }
            });
            return this;
        };

        this.customizeCaption = function (caption) {
            caption = caption || calendar.getRoot().caption;
            caption.classList.add('caption');
        };

        /**
         *  Initializing
         */
        this.customizeCalendar = function (newCalendar) {
            calendar = newCalendar || this;
            var customizeCaption = that.customizeCaption();
            var customizedDays = that.customizeDays();
            var customizedDayNames = that.customizeDayNames();
        };

        function rowsForEach(rows, func) {
            Array.prototype.slice.call(rows)
                .forEach(function (row) {
                    Array.prototype.slice.call(row.cells)
                        .forEach(function (cell) {
                            func(cell);
                        });
                });
        }

        function rowForEach(row, func) {
            Array.prototype.slice.call(row)
                .forEach(function (cell) {
                    func(cell);
                });

        }

        function renderCaption() {
            var tableString = '<caption><button class="calendar-button desc"></button><span>'
                + (model.chosenMonth + ' ' + config.year)
                + '</span><button class="calendar-button asc"></button></caption>';
            root.innerHTML = tableString;
            return tableString;
        }

        function renderHeader() {
            if (config.daysInWeek / 7 - Math.floor(config.daysInWeek / 7) != 0) return false;
            var weekNumber = 0, tableString = '<thead>';
            for (var i = 0; i < config.daysInWeek; i++) {
                weekNumber = Math.floor(i / 7);
                tableString += '<td dayName = ' + model.arrayOfDays[0][i - weekNumber * 7].toString() + '>' + model.arrayOfDays[0][i - weekNumber * 7].toString() + '</td>';
            }
            tableString += '</thead>';
            root.innerHTML += tableString;
            return tableString;
        }

        /**
         * rendering table
         */
        function renderBody() {
            root.classList.add('calendar');
            var tableString = '', i = 0, newMonthDay = 1,
                date = new Date(config.year, config.month - 2),
                lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
                firstDayWeek = new Date(date.getFullYear(), date.getMonth() + 1, 1).getDay();
            tableString += '<tbody>';
            var weekNumber = 0;
            model.arrayOfDays.map(function (week) {

                if (weekNumber == 0) {
                    weekNumber++;
                    return false;
                }
                tableString += '<tr>';
                for (i = 0; i < config.daysInWeek; i++) {
                    if (week[i]) {
                        tableString += '<td dayNumber = ' + week[i].toString() + 'class="active-day">' + week[i].toString() + '</td>';
                    }
                    else {
                        if (weekNumber == 1) {
                            tableString += '<td class="non-active-day">' + (lastDay - firstDayWeek + 1 - config.daysInWeek + 7).toString() + '</td>';
                            firstDayWeek--;
                        } else {
                            tableString += '<td class="non-active-day">' + (newMonthDay).toString() + '</td>';
                            newMonthDay++;
                        }

                    }
                }
                tableString += '</tr>';
                weekNumber++;
            });
            tableString += '</tbody>';
            root.innerHTML += tableString;
            return this;
        }

        /**
         * Ajax request to get localization
         * @returns {XMLHttpRequest}
         */
        function getLocalization() {
            var xhr = new XMLHttpRequest();
            Calendar.localizationCache[config.locale] = XMLHttpRequest;
            xhr.open("GET", "localization/" + config.locale + ".json", true);
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
            var generatedCalendar = generateCalendar();
            var renderedCaption = renderCaption();
            var renderedHeader = renderHeader();
            var renderedBody = renderBody();
            if (config.style != 'default') {
                that.customizeCalendar(that);
                that.customizeWeekends(config.weekends, config.daysInWeek);
                var today = new Date();
                if ((today.getMonth() + 1 == config.month) && (today.getFullYear() == config.year)) {
                    that.customizeToday(new Date());
                }
            }
            return this;
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
            return this;
        }
    };
    Calendar.extend(EventMachine);
})(window, document);