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
        var range1 = [1,31]

        function init(){
            that.firstCalendar = new Calendar(container, {style:"customize"});
            that.secondCalendar = new Calendar(container, {style:"customize"});
            console.log("created date range picker");
            var monthTestFunction = function(e){
                console.log('month changed', e, this);
            };
            var firstHandler = function(params){
                range1[1] = params.target.getAttribute('day-number');
                console.log(that.firstCalendar);
                that.firstCalendar.customizeDays('selected', range1);
            };
            var secondHandler = function(params){
                console.log('day changed', this, params);
                console.log(params.target.getAttribute('day-number'));
            };
            that.firstCalendar.on('onMonthChanged',monthTestFunction);
            that.firstCalendar.on('onDayChanged', secondHandler);
            that.secondCalendar.on('onDayChanged', firstHandler);
        }
        init.call(this);
    };
})(window, document);