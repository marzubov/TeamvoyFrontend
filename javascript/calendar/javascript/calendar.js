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
                if(value['month']!=config['month']){
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
            myDays.forEach(function(el,i){
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
            markDayEvents();
        }

        function markDayEvents(){
            config.dayEvents.forEach(function(dEvent){
                if(dEvent.date.getFullYear() === config.year &&
                    dEvent.date.getMonth()+1 === config.month){
                    model.arrayOfDays.forEach(function(week){
                        week[week.indexOf(dEvent.date.getDate())] = '<span data-message="'+ dEvent.message +'" class="calendar-event">'
                            + week[week.indexOf(dEvent.date.getDate())] + '<span>';
                    });
                }
            })
        }

        function renderTable() {
            that.rootElement.classList.add('calendar');
            var tableString = '',
                td;

            //make caption
            tableString += '<caption class="caption"><button class="calendar-button desc"></button><span>'
                + (model.chosenMonth + ' ' + config.year)
                + '</span><button class="calendar-button asc"></button></caption>';

            //make body
            tableString += '<tbody>';
            model.arrayOfDays.forEach(function (el) {
                tableString += '<tr><td class="active-day">' + (el.join("</td><td class='active-day' >")) + '</td></tr>';
            });
            tableString += '<tbody>';
            that.rootElement.innerHTML = tableString;
        }

        function renderNamesOfWeek(){
            //adding non-active class to the names of days
            Array.prototype.slice.call(that.rootElement.rows[0].cells)
                .forEach(function (cell) {
                    cell.classList.remove('active-day');
                    cell.classList.add('non-active-day');
                });
        }

        function renderNonActiveDays(){

            var date = new Date(config.year, config.month - 2), td,
                lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
                firstDayWeek = new Date(date.getFullYear(), date.getMonth()+1, 1).getDay(),
                rowLength;
            if (config.locale == 'en'){
                firstDayWeek-=1;
            }
            else{
                firstDayWeek-=2;
            }

            //adding previous month and next month days in empty cells
            Array.prototype.slice.call(that.rootElement.rows[1].cells)
                .forEach(function (cell) {
                    if (cell.innerHTML == ''){
                        cell.innerHTML = (lastDay - firstDayWeek).toString();
                        firstDayWeek--;
                        cell.classList.remove('active-day');
                        cell.classList.add('non-active-day');
                    }
                });

            rowLength = that.rootElement.rows[that.rootElement.rows.length-1].cells.length.valueOf();
            for (var i = 0; i<7-rowLength;i++){
                td = document.createElement('td');
                td.classList.add("non-active-day");
                td.innerHTML = (i+1).toString();
                that.rootElement.rows[that.rootElement.rows.length-1].appendChild(td);
            }
        }

        function renderInfoContainer(){
            var infoContainer = document.createElement('div'),
                dayInfo = document.createElement('span');
            infoContainer.classList.add('info-container');
            dayInfo.innerHTML = " Her goes clicked day information";
            that.dayInfo = dayInfo;
            infoContainer.appendChild(dayInfo);
            infoContainer.appendChild(createCloseButton());
            document.body.appendChild(infoContainer);
            return infoContainer;
        }

        function showDayInfo(e){
            if (e.target != this){
                if (e.target.classList.contains('active-day')) {
                    var currentPosition = findPos(e.target);
                    that.infoContainer.classList.add('info-container-active');
                    that.infoContainer.style.left = (currentPosition.left + e.target.offsetWidth).toString() + 'px';
                    that.infoContainer.style.top = (currentPosition.top + e.target.offsetHeight).toString() + 'px';
                    that.dayInfo.innerHTML = "Day info: <br/>" + e.target.innerHTML +'.'+ that.config.month + '.' + that.config.year;
                    return true;
                }
                return false;
            }
            else{
                return false;
            }
        }

        function createCloseButton(){
            var closeButton = document.createElement('div');
            closeButton.innerHTML = '<button type="button" class="close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
            closeButton.childNodes[0].addEventListener('click', closeInfoContainer);
            closeButton.childNodes[0].classList.add('close-button');
            return closeButton.childNodes[0];
        }

        function closeInfoContainer(){
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
                .addEventListener('click', function(e){
                    if (e.target.classList.contains('calendar-button')){
                        e.target.classList.contains('asc') ? config.month++ : config.month--;
                        if(config.month > 12){
                            config.year++;
                            config.month = 1;
                        }
                        else if(config.month < 1){
                            config.year--;
                            config.month = 12;
                        }
                        that.trigger('onMonthChanged');
                        render();
                    }
                });


           Array.prototype.slice.call(that.rootElement.querySelectorAll('.calendar-event'))
                .forEach(function(el){
                    el.addEventListener('mouseover', function(){
                        console.log(el.dataset.message);
                    })
                })
        }

        function render() {
            generateCalendar();
            renderTable();
            renderNamesOfWeek();
            renderNonActiveDays();
            that.infoContainer = renderInfoContainer();
            that.rootElement.addEventListener('click', showDayInfo);
        }

        function init(){
            that.rootElement = document.createElement('table');
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