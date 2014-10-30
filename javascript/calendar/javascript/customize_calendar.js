(function (global, document) {
    "use strict";
    /**
     *
     * @param calendar
     * @constructor
     */
    global.Calendar.prototype.CustomizeCalendar = function (calendar){
        var that = this;
        /**
         *  Customizing days styles
         */
        this.customizeDays = function (){
            var weekNumber = 0;
            Array.prototype.slice.call(calendar.getRoot().rows)
                .forEach(function (row) {
                    Array.prototype.slice.call(row.cells)
                        .forEach(function (cell) {
                            if (weekNumber == 0){
                                // its just day names, so we are skipping this iteration

                                return false;
                            }else {

                                //here customizing days
                                //checking if day isn't from another month

                                if (!cell.classList.contains('non-active-day')){
                                    cell.classList.add('active-day');
                                }
                            }
                        });
                    weekNumber++;
                });
        };

        /**
         *  Customizing days names style
         */
        this.customizeDayNames = function (){
            Array.prototype.slice.call(calendar.getRoot().rows[0].cells)
                .forEach(function (dayName) {
                    dayName.classList.add('day-name');
                });
        };

        this.customizeWeekends = function (first,second){
            var weekNumber = 0;
            var dayNumber = 0;
            Array.prototype.slice.call(calendar.getRoot().rows)
                .forEach(function (row) {
                    Array.prototype.slice.call(row.cells)
                        .forEach(function (cell) {

                            if ((dayNumber == first)||(dayNumber == second)){
                                cell.classList.add('weekend');
                            }
                            dayNumber++;
                        });
                    weekNumber++;
                    dayNumber = 0;
                });
        };

        this.customizeToday = function (today){
            Array.prototype.slice.call(calendar.getRoot().rows)
                .forEach(function (row) {
                    Array.prototype.slice.call(row.cells)
                        .forEach(function (cell) {
                            if (today.getDate() == cell.getAttribute('dayNumber')){
                                cell.classList.add('today')
                            }
                        });
                });
        };

        /**
         *  Initializing
         */
        this.init = function(){
            that.customizeDays();
            that.customizeDayNames();
        };

        that.init();
    };
})(window, document);