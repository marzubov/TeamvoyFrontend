(function (global, document) {
  "use strict";
  var DateRangePicker = global.DateRangePicker = function (container) {
    DateRangePicker.superclass.constructor.call(this);
    var that = this;
    this.firstCalendar = {};
    this.secondCalendar = {};
    var range = this.range = {
      start: moment([2014, 10, 1]),
      end: moment([2014, 10, 10])
    };

    this.getRange = function () {
      return range;
    };

    this.render = function () {
      that.firstCalendar.render();
      that.secondCalendar.render();
      that.firstCalendar.selectDays(range);
      that.secondCalendar.selectDays(range);
    };

    /**
     * Event handler on first date range picker calendar
     * @param e
     */
    var firstHandler = function (e) {
      e.preventDefault();

      if (!e.target.date) return false;
      if (e.target.date.calendar() == range.end.calendar()) return false;
      if (e.target.date.isBefore(range.start)) {
        var difference = range.end.diff(range.start);
        range.end = e.target.date.clone();
        range.start = range.end.clone().subtract(difference,'milliseconds');
      }
      range.end = e.target.date.clone();
      that.render();
    };

    /**
     * Event handler on second date range picker calendar
     * @param e
     */
    var secondHandler = function (e) {
      e.preventDefault();

      if (!e.target.date) return false;
      if (e.target.date.calendar() == range.start.calendar()) return false;
      if (e.target.date.isAfter(range.end)) {
        var difference = range.end.diff(range.start);
        range.start = e.target.date.clone();
        range.end = range.start.clone().add(difference,'milliseconds');
      }
      range.start = e.target.date.clone();
      that.render();
    };

    /**
     * Initializing
     */
    function init() {
      range.start.locale('en').format('LLL');
      range.end.locale('en').format('LLL')

      that.firstCalendar = new Calendar(container, {});
      that.secondCalendar = new Calendar(container, {});

      //setting on calendars load events

      that.firstCalendar.selectDays(range);
      that.secondCalendar.selectDays(range);

      //adding mousedown listener
      that.firstCalendar.getRoot().addEventListener('mousedown', function(e){
        if (!e.target.date) return false;
        secondHandler(e);
        that.firstCalendar.getRoot().addEventListener('mousemove', secondHandler);
      });
      that.secondCalendar.getRoot().addEventListener('mousedown', function(e){
        if (!e.target.date) return false;
        firstHandler(e);
        that.secondCalendar.getRoot().addEventListener('mousemove', firstHandler);
      });

      //adding mouseup listener
      that.firstCalendar.getRoot().addEventListener('mouseup', function(e){
        if (!e.target.date) return false;
        that.firstCalendar.config = {month: range.start.get('month')+1};
        that.secondCalendar.config = {month: range.end.get('month')+1};
        secondHandler(e);
        that.firstCalendar.getRoot().removeEventListener('mousemove', secondHandler);
        that.render();
      });
      that.secondCalendar.getRoot().addEventListener('mouseup', function(e){
        if (!e.target.date) return false;
        that.firstCalendar.config = {month: range.start.get('month')+1};
        that.secondCalendar.config = {month: range.end.get('month')+1};
        firstHandler(e);
        that.secondCalendar.getRoot().removeEventListener('mousemove', firstHandler);
        that.render();
      });

      //adding monthChanged listener
      that.firstCalendar.on('monthChanged', function(month){
        that.render();
      });
      that.secondCalendar.on('monthChanged', function(month){
        that.render();
      });

    }

    init.call(this);
  };
  DateRangePicker.extend(EventMachine);
})(window, document);
