(function (global, document) {
    "use strict";
    /**
     *
     * @param calendar
     * @constructor
     */
    global.Calendar.prototype.customizeCalendar = function (calendar){
        var that = this;
        /**
         *  Customizing days styles
         */
        this.customizeDays = function (){
            var ifFirstRow = true;
            rowsForEach(calendar.getRoot().rows, function (cell){
                if (!ifFirstRow){
                    // its just day names, so we are skipping this iteration
                    ifFirstRow = false;
                }else {
                    //here customizing days
                    //checking if day isn't from another month
                    if (!cell.classList.contains('non-active-day')){
                        cell.classList.add('active-day');
                    }
                }
            });
            return this;
        };

        /**
         *  Customizing days names style
         */
        this.customizeDayNames = function (header){
            header = header || calendar.getRoot().rows[0];
            rowForEach(header.cells, function(dayName){
                dayName.classList.add('day-name');
            });
            return this;
        };

        this.customizeWeekends = function (weekends, daysInWeek){
            var weekNumber = 0;
            var dayNumber = 0;
            rowsForEach(calendar.getRoot().rows, function (cell){
                weekNumber = Math.floor(dayNumber / 7);
                //calendar.getRoot().rows[0] - header row
                //.cells[dayNumber] - array of td
                //.getAttribute('dayName')) - dayName attribute for comparison
                if (weekends.indexOf(calendar.getRoot().rows[0]
                        .cells[dayNumber]
                        .getAttribute('dayName'))!=-1){
                    cell.classList.add('weekend');
                }
                dayNumber++;
                if (dayNumber == daysInWeek) dayNumber = 0;
            });
            return this;
        };

        this.customizeToday = function (today){
            rowsForEach(calendar.getRoot().rows, function (cell){
                if (today.getDate() == cell.getAttribute('dayNumber')){
                    cell.classList.add('today');
                }
            });
            return this;
        };

        this.customizeCaption = function (caption) {
            caption = caption || that.getRoot().caption;
            caption.classList.add('caption');
        };

        /**
         *  Initializing
         */
        this.init = function(){
            var customizeCaption = that.customizeCaption();
            var customizedDays = that.customizeDays();
            var customizedDayNames = that.customizeDayNames();
        };

        function rowsForEach(rows, func){
            Array.prototype.slice.call(rows)
                .forEach(function (row) {
                    Array.prototype.slice.call(row.cells)
                        .forEach(function (cell){
                            func(cell);
                        });
                });
        }

        function rowForEach (row, func){
            Array.prototype.slice.call(row)
                .forEach(function (cell) {
                    func(cell);
                });

        }

        that.init();
    };
})(window, document);