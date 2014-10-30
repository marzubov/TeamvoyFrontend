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
        this.day = function (){
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
        this.dayNames = function (){
            Array.prototype.slice.call(calendar.getRoot().rows[0].cells)
                .forEach(function (dayName) {
                    dayName.classList.add('day-name');
                });
        };

        this.weekends = function (){

        };

        this.today = function (){

        };

        /**
         *  Initializing
         */
        this.init = function(){
            that.day();
            that.dayNames();
        };

        that.init();
    };
})(window, document);