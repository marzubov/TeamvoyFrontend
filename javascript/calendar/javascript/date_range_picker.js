(function (global, document) {
    var DateRangePicker = global.DateRangePicker = function (container) {
        var that = this;
        this.firstCalendar = {};
        this.secondCalendar = {};
        var range = this.range = {
            start: new Date(2014, 10, 2),
            end: new Date(2014, 10, 5)
        };

        function init() {
            that.firstCalendar = new Calendar(container, {style: "default", dateRangePicker: true});
            that.secondCalendar = new Calendar(container, {style: "default", dateRangePicker: true});
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

            var firstHandler = function (params) {
                var newDate = new Date(parseFloat(params.target.getAttribute('year')), parseFloat(params.target.getAttribute('month')) - 1
                    , parseFloat(params.target.getAttribute('day-number')));
                if (range.start.getTime() > newDate.getTime()) {
                    var dateDifference = range.end.getTime() - range.start.getTime();
                    range.start = new Date(newDate.getTime() - dateDifference);
                }
                range.end = newDate;

                that.firstCalendar.config = {year: range.start.getFullYear(), month: range.start.getMonth() + 1};
                that.secondCalendar.config = {year: range.end.getFullYear(), month: range.end.getMonth() + 1};
                that.firstCalendar.selectDays('selected', range);
                that.secondCalendar.selectDays('selected', range);
                that.firstCalendar.addDayStyle(range.start, 'selected-start-day');
                that.secondCalendar.addDayStyle(range.end, 'selected-end-day');
            };

            var secondHandler = function (params) {
                var newDate = new Date(parseFloat(params.target.getAttribute('year')), parseFloat(params.target.getAttribute('month')) - 1
                    , parseFloat(params.target.getAttribute('day-number')));
                if (range.end.getTime() < newDate.getTime()) {
                    var dateDifference = range.end.getTime() - range.start.getTime();
                    range.end = new Date(newDate.getTime() + dateDifference);
                }
                range.start = newDate;

                that.firstCalendar.config = {year: range.start.getFullYear(), month: range.start.getMonth() + 1};
                that.secondCalendar.config = {year: range.end.getFullYear(), month: range.end.getMonth() + 1};
                that.firstCalendar.selectDays('selected', range);
                that.secondCalendar.selectDays('selected', range);
                that.firstCalendar.addDayStyle(range.start, 'selected-start-day');
                that.secondCalendar.addDayStyle(range.end, 'selected-end-day');
            };
            that.firstCalendar.on('onMonthChanged', function (e) {
                that.firstCalendar.selectDays('selected', range);
                that.firstCalendar.addDayStyle(range.start, 'selected-start-day');
            });
            that.secondCalendar.on('onMonthChanged', function (e) {
                that.secondCalendar.selectDays('selected', range);
                that.secondCalendar.addDayStyle(range.end, 'selected-end-day');
            });
            that.firstCalendar.on('onDayChanged', secondHandler);
            that.secondCalendar.on('onDayChanged', firstHandler);
        }

        init.call(this);
    };
})(window, document);