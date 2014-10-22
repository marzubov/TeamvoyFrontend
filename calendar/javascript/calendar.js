(function (window, document) {
    "use strict";
    /**
     * Creates calendar and inserts it in container
     * @param container - Place in the DOM where calendar will be inserted
     * @param properties - Optional. Config object, has such fields like: year, month, firstDayOfWeek, locale, output
     * @constructor
     */
    window.Calendar = function (container, properties) {
        var that = this;
        this.container = container;
        this.rootElement = undefined;
        this.model = {};
        this.config = {
            year: (new Date()).getFullYear(),
            month: (new Date()).getMonth() + 1,
            firstDayOfWeek: "sunday",
            locale: "en",
            output: "text"
        };
        Calendar.localizationCache = {};

        //public methods
        /**
         * Generates new calendar. Config changes take effect
         */
        this.reDraw = function () {
            this.loadLocalization(this.config.locale);
        };
        /**
         * Show current day in calendar
         */
        this.today = function () {
            var today = new Date();
            this.config.month = today.getMonth() + 1;
            this.config.year = today.getFullYear();
            this.reDraw();
        };
        /**
         * Load localization if it does not in cache already
         * @param locale. Example: 'en' gets english localization
         */
        this.loadLocalization = function(locale) {
            this.config.locale = locale ? locale : this.config.locale;
            if (Calendar.localizationCache[this.config.locale]) {
                generateCalendar();
                renderTable();
                this.container.appendChild(this.rootElement);
            }
            else {
                ajaxRequest();
            }
        };

        /**
         * Set month to next or previous
         * @param direction. If direction>0 take next month else previous
         */
        this.nextMonth = function (direction) {
            if (direction > 0) {
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

        init(properties);
        //private methods

        function generateCalendar() {
            var dataMonth = Calendar.localizationCache[that.config.locale];
            var i, date = new Date(that.config.year, that.config.month - 1), month, monthPrefix,
                lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
                firstDayWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
                myMonth = ["january", "february", "march", "april", "may", "june",
                    "july", "august",
                    "september", "october",
                    "november", "december"],
                myDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
                indexOfStartDay, days = [];

            indexOfStartDay = myDays.indexOf(that.config.firstDayOfWeek);

            that.model.chosenMonth = dataMonth.month[myMonth[that.config.month - 1]];

            for (i = 0; i < myDays.length; i += 1) {
                days[i] = dataMonth.daysOfWeek[myDays[i]];
            }
            that.model.arrayOfDays = [];
            days = days.slice(indexOfStartDay, 7).concat(days.slice(0, indexOfStartDay));
            that.model.arrayOfDays.push(days);

            month = Array.apply(null, {length: lastDay}).map(function (el, i) {
                return i + 1;
            });
            firstDayWeek = (7 - (indexOfStartDay + 1 - firstDayWeek)) % 7;
            monthPrefix = new Array(firstDayWeek);
            month = monthPrefix.concat(month);

            for (i = 0; i < month.length; i += 7) {
                that.model.arrayOfDays.push(month.slice(i, i + 7));
            }

        }

        function renderTable() {
            if (!that.rootElement)
                that.rootElement = document.createElement('table');
            that.rootElement.classList.add('calendar');
            var tableString = '',
                today = new Date(),
                isToday, td;
            if(today.getMonth()+1 == that.config.month && today.getFullYear() == that.config.year){
                isToday=true;
            }
            //make caption
            tableString += '<caption><button class="calendar-button desc"></button>'
                + (that.model.chosenMonth + ' ' + that.config.year)
                + '<button class="calendar-button asc"></button></caption>';
            //make body
            tableString += '<tbody>';
            that.model.arrayOfDays.forEach(function (el) {
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
            Calendar.localizationCache[that.config.locale] = XMLHttpRequest;
            oReq.onload = function () {
                Calendar.localizationCache[that.config.locale] = JSON.parse(this.responseText);
                generateCalendar();
                renderTable();
                that.container.appendChild(that.rootElement);
            };
            oReq.open("post", "localization/" + that.config.locale + ".json", true);
            oReq.send(null);
        }

        function setEvents() {
            var buttons = that.rootElement.querySelectorAll('button');
            buttons = Array.prototype.slice.call(buttons);
            buttons.forEach(function (el) {
                el.addEventListener('click', function () {
                    this.classList.contains('asc') ?
                        that.nextMonth(1) : that.nextMonth(-1);
                });
            });
            var isFocused;
            var temp = 0;
            that.rootElement.onmouseover = function () {
                isFocused = true;
            };
            that.rootElement.onmouseout = function () {
                isFocused = false;
            };
        }

        function init(properties) {
            that.config.merge(properties);
            that.loadLocalization();
        }
    };
})(window, document);