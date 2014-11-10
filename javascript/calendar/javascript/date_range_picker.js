(function (global, document) {
  "use strict";
  var DateRangePicker = global.DateRangePicker = function (container) {
    EventMachine.call(this);
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
     * @param e - event object
     */
    var firstHandler = function (e) {
      e.preventDefault();

      if (!e.target.date) return false;

      var selectedDate = moment(e.target.date).locale('en');

      if (selectedDate.calendar() == range.end.calendar()) return false;
      if (selectedDate.isBefore(range.start)) {
        var difference = range.end.diff(range.start);
        range.end = selectedDate.clone();
        range.start = range.end.clone().subtract(difference, 'milliseconds');
      }
      range.end = selectedDate.clone();
      that.render();
      that.trigger('rangeChanged', [range]);
    };

    /**
     * Event handler on second date range picker calendar
     * @param e
     */
    var secondHandler = function (e) {
      e.preventDefault();

      if (!e.target.date) return false;

      var selectedDate = moment(e.target.date).locale('en');

      if (selectedDate.calendar() == range.start.calendar()) return false;
      if (selectedDate.isAfter(range.end)) {
        var difference = range.end.diff(range.start);
        range.start = selectedDate.clone();
        range.end = range.start.clone().add(difference, 'milliseconds');
      }
      range.start = selectedDate.clone();
      that.render();
      that.trigger('rangeChanged', [range]);
    };

    this.configMonthAndYear = function () {
      that.firstCalendar.config = {month: range.start.get('month') + 1};
      that.secondCalendar.config = {month: range.end.get('month') + 1};
      that.firstCalendar.config = {year: range.start.get('year')};
      that.secondCalendar.config = {year: range.end.get('year')};
    };

    function init() {
      range.start.locale('en').format('LLL');
      range.end.locale('en').format('LLL')

      that.firstCalendar = new Calendar(container, {});
      that.secondCalendar = new Calendar(container, {});

      //setting on calendars load events

      that.firstCalendar.selectDays(range);
      that.secondCalendar.selectDays(range);

      //adding mousedown listener
      that.firstCalendar.getRoot().addEventListener('mousedown', function (e) {
        if (!e.target.date) return false;
        secondHandler(e);
        document.addEventListener('mousemove', secondHandler);
      });
      that.secondCalendar.getRoot().addEventListener('mousedown', function (e) {
        if (!e.target.date) return false;
        firstHandler(e);
        document.addEventListener('mousemove', firstHandler);
      });

      //adding mouseup listener
      document.addEventListener('mouseup', function (e) {
        if (!e.target.classList.contains('calendar-button')) that.configMonthAndYear();
        document.removeEventListener('mousemove', secondHandler);
      });
      document.addEventListener('mouseup', function (e) {
        if (!e.target.classList.contains('calendar-button')) that.configMonthAndYear();
        document.removeEventListener('mousemove', firstHandler);
      });

      //adding render listener
      that.firstCalendar.on('render', function () {
        that.firstCalendar.selectDays(range);
        that.secondCalendar.selectDays(range);
      });
      that.secondCalendar.on('render', function () {
        that.firstCalendar.selectDays(range);
        that.secondCalendar.selectDays(range);
      });

    }

    init.call(this);
  };
})(window, document);
