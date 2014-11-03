(function (global, document) {
    "use strict";
    var DateRangePicker = global.DateRangePicker = function (container) {
        DateRangePicker.superclass.constructor.call(this);
        var that = this;
        this.firstCalendar = {};
        this.secondCalendar = {};
        var range = this.range = {
            start: new Date(2014, 10, 2),
            end: new Date(2014, 10, 5)
        };

        this.getRange = function () {
            return range;
        };

        this.render = function () {
            that.firstCalendar.render();
            that.secondCalendar.render();
            that.firstCalendar.selectDays('selected', range);
            that.secondCalendar.selectDays('selected', range);
            that.firstCalendar.addDayStyle(range.start, 'selected-start-day');
            that.secondCalendar.addDayStyle(range.end, 'selected-end-day');
        };

        /**
         * Event handler on first date range picker calendar
         * @param params
         */
        var firstHandler = function (params) {
            var newDate = new Date(parseFloat(params.target.getAttribute('year')), parseFloat(params.target.getAttribute('month')) - 1
                , parseFloat(params.target.getAttribute('day-number')));
            if (newDate.getTime() == range.end.getTime()) {
                return false;
            }
            if (range.start.getTime() > newDate.getTime()) {
                var dateDifference = range.end.getTime() - range.start.getTime();
                range.start = new Date(newDate.getTime() - dateDifference);
            }
            range.end = newDate;
            that.render();
        };

        /**
         * Event handler on second date range picker calendar
         * @param params
         */
        var secondHandler = function (params) {
            var newDate = new Date(parseFloat(params.target.getAttribute('year')), parseFloat(params.target.getAttribute('month')) - 1
                , parseFloat(params.target.getAttribute('day-number')));
            if (newDate.getTime() == range.start.getTime()) {
                return false;
            }
            if (range.end.getTime() < newDate.getTime()) {
                var dateDifference = range.end.getTime() - range.start.getTime();
                range.end = new Date(newDate.getTime() + dateDifference);
            }
            range.start = newDate;

            that.render();
        };

        /**
         * Initializing
         */
        function init() {
            that.firstCalendar = new Calendar(container, {style: "default", dateRangePicker: true});
            that.secondCalendar = new Calendar(container, {style: "default", dateRangePicker: true});

            //setting on calendars load events
            that.firstCalendar.on('onLoad', function onFirstLoad() {
                that.firstCalendar.selectDays('selected', range);
                that.firstCalendar.addDayStyle(range.start, 'selected-start-day');
                that.secondCalendar.off('onFirstLoad');
            });
            that.secondCalendar.on('onLoad', function onSecondLoad() {
                that.secondCalendar.selectDays('selected', range);
                that.secondCalendar.addDayStyle(range.end, 'selected-end-day');
                that.secondCalendar.off('onSecondLoad');
            });

            //setting events
            that.firstCalendar.on('onMonthChanged', function (e) {
                that.firstCalendar.selectDays('selected', range);
                that.firstCalendar.addDayStyle(range.start, 'selected-start-day');
            });
            that.secondCalendar.on('onMonthChanged', function (e) {
                that.secondCalendar.selectDays('selected', range);
                that.secondCalendar.addDayStyle(range.end, 'selected-end-day');
            });
            that.firstCalendar.on('onMouseDown', function (e) {
                secondHandler(e);
                that.firstCalendar.on('onMouseMove', secondHandler);
            });
            that.secondCalendar.on('onMouseDown', function (e) {
                firstHandler(e);
                that.secondCalendar.on('onMouseMove', firstHandler);
            });
            that.firstCalendar.on('onMouseUp', function (e) {
                that.firstCalendar.off('onMouseMove', secondHandler);
                that.firstCalendar.config = {year: range.start.getFullYear(), month: range.start.getMonth() + 1};
                that.secondCalendar.config = {year: range.end.getFullYear(), month: range.end.getMonth() + 1};
                that.render();
                that.trigger('rangeChanged', [range]);
            });
            that.secondCalendar.on('onMouseUp', function (e) {
                that.secondCalendar.off('onMouseMove', firstHandler);
                that.firstCalendar.config = {year: range.start.getFullYear(), month: range.start.getMonth() + 1};
                that.secondCalendar.config = {year: range.end.getFullYear(), month: range.end.getMonth() + 1};
                that.render();
                that.trigger('rangeChanged', [range]);
            });
        }

        init.call(this);
    };
    DateRangePicker.extend(EventMachine);
})(window, document);