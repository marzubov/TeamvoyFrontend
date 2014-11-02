(function (global, document) {
    var DateRangePicker = global.DateRangePicker = function (container) {
        var that = this;
        this.firstCalendar = {};
        this.secondCalendar = {};
        var range = {
            start: {
                year: 2014,
                month: 10,
                day: 30
            },
            end: {
                year: 2014,
                month: 10,
                day: 30
            }
        };
        var range1 = [1,1];

        function init(){
            that.firstCalendar = new Calendar(container, {style:"default", dateRangePicker: true});
            that.secondCalendar = new Calendar(container, {style:"default", dateRangePicker: true});

            console.log("created date range picker");
            var monthTestFunction = function(e){
                console.log('month changed', e, this);
            };
            var firstHandler = function(params){
                that.firstCalendar.removeDayStyle(range1[0], 'selected-start-day');
                that.secondCalendar.removeDayStyle(range1[1], 'selected-end-day');
                range1[1] = parseFloat(params.target.getAttribute('day-number'));
                that.firstCalendar.selectDays('selected', range1);
                that.secondCalendar.selectDays('selected', range1);
                that.firstCalendar.addDayStyle(range1[0], 'selected-start-day');
                that.secondCalendar.addDayStyle(range1[1], 'selected-end-day');
            };
            var secondHandler = function(params){
                that.firstCalendar.removeDayStyle(range1[0], 'selected-start-day');
                that.firstCalendar.removeDayStyle(range1[1], 'selected-end-day');
                range1[0] = parseFloat(params.target.getAttribute('day-number'));
                that.firstCalendar.selectDays('selected', range1);
                that.secondCalendar.selectDays('selected', range1);
                that.firstCalendar.addDayStyle(range1[0], 'selected-start-day');
                that.secondCalendar.addDayStyle(range1[1], 'selected-end-day');
            };
            that.firstCalendar.on('onMonthChanged',monthTestFunction);
            that.firstCalendar.on('onDayChanged', secondHandler);
            that.secondCalendar.on('onDayChanged', firstHandler);
        }
        init.call(this);
    };
})(window, document);