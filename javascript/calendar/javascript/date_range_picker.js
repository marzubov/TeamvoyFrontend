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
            this.firstCalendar = new Calendar(container);
            this.secondCalendar = new Calendar(container);
            console.log("created date range picker");
            //var monthTestFunction = function(e){
            //    console.log('month changed', e, this);
            //};
            var firstHandler = function(params){
                //console.log('day changed', this, params);
                //console.log(params.target.getAttribute('day-number'));
                //console.log(this.getDate(params.target.getAttribute('day-number')));
                range1[1] = params.target.getAttribute('day-number');
                console.log(that.firstCalendar);
                that.firstCalendar.customizeDays('selected', range1);
            };
            var secondHandler = function(params){
                console.log('day changed', this, params);
                console.log(params.target.getAttribute('day-number'));
                console.log(this.getDate(params.target.getAttribute('day-number')));
            };
            //firstCalendar.on('onMonthChanged',monthTestFunction);
            this.firstCalendar.on('onDayChanged', secondHandler);
            this.secondCalendar.on('onDayChanged', firstHandler);
        }

        init.call(this);
    };
})(window, document);