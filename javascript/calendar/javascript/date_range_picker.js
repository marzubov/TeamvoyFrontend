(function (global, document) {
  "use strict";
  global.DateRangePicker = function (container) {
    EventMachine.call(this);
    var that = this,
      range = {
        start: moment([2014, 10, 1]),
        end: moment([2014, 10, 10])
      };
    this.firstCalendar = {};
    this.secondCalendar = {};


    this.getRange = function () {
      return range;
    };

    this.selectFirstDays = function () {
      var momentDate,
        calendarBody = that.firstCalendar.getRoot().querySelector('.calendar-body');
      Array.prototype.slice.call(calendarBody.childNodes)
        .forEach(function (day) {
          momentDate = moment(day.date).locale('en');

          //styling selected days
          if (momentDate.isAfter(range.start) && momentDate.isBefore(range.end)) {
            day.classList.add('selected');
          }

          //styling start and end
          if (momentDate.calendar() === range.start.calendar()) {
            day.classList.add('selected-start');
          }
          if (momentDate.calendar() === range.end.calendar()) {
            day.classList.add('selected-end');
          }
        });
      return this;
    };

    this.selectSecondDays = function () {
      var momentDate,
        calendarBody = that.secondCalendar.getRoot().querySelector('.calendar-body');
      Array.prototype.slice.call(calendarBody.childNodes)
        .forEach(function (day) {
          momentDate = moment(day.date).locale('en');

          //styling selected days
          if (momentDate.isAfter(range.start) && momentDate.isBefore(range.end)) {
            day.classList.add('selected');
          }

          //styling start and end
          if (momentDate.calendar() === range.start.calendar()) {
            day.classList.add('selected-start');
          }
          if (momentDate.calendar() === range.end.calendar()) {
            day.classList.add('selected-end');
          }
        });
      return this;
    };

    this.render = function () {
      that.firstCalendar.render();
      that.secondCalendar.render();
      that.selectFirstDays();
      that.selectSecondDays();
    };

    /**
     * Event handler on first date range picker calendar
     * @param e - event object
     */
    function firstHandler(e) {
      e.preventDefault();

      if (!e.target.date) {
        return false;
      }

      var difference,
        selectedDate = moment(e.target.date).locale('en');

      if (selectedDate.calendar() === range.end.calendar()) {
        return false;
      }
      if (selectedDate.isBefore(range.start)) {
        difference = range.end.diff(range.start);
        range.end = selectedDate.clone();
        range.start = range.end.clone().subtract(difference, 'milliseconds');
      }
      range.end = selectedDate.clone();
      that.render();
      that.trigger('rangeChanged', [[range.start.clone()._d, range.end.clone()._d]]);
    }

    /**
     * Event handler on second date range picker calendar
     * @param e
     */
    function secondHandler(e) {
      e.preventDefault();

      if (!e.target.date) {
        return false;
      }

      var difference,
        selectedDate = moment(e.target.date).locale('en');

      if (selectedDate.calendar() === range.start.calendar()) {
        return false;
      }
      if (selectedDate.isAfter(range.end)) {
        difference = range.end.diff(range.start);
        range.start = selectedDate.clone();
        range.end = range.start.clone().add(difference, 'milliseconds');
      }
      range.start = selectedDate.clone();
      that.render();
      that.trigger('rangeChanged', [[range.start.clone()._d, range.end.clone()._d]]);
    }

    this.configMonthAndYear = function () {
      that.firstCalendar.config = {month: range.start.get('month') + 1};
      that.secondCalendar.config = {month: range.end.get('month') + 1};
      that.firstCalendar.config = {year: range.start.get('year')};
      that.secondCalendar.config = {year: range.end.get('year')};
    };

    function init() {
      range.start.locale('en').format('LLL');
      range.end.locale('en').format('LLL');

      that.firstCalendar = new Calendar(container, {});
      that.secondCalendar = new Calendar(container, {});

      //setting on calendars load events

      that.selectFirstDays();
      that.selectSecondDays();

      //adding mousedown listener
      that.firstCalendar.getRoot().addEventListener('mousedown', function (e) {
        if (!e.target.date) {
          return false;
        }
        secondHandler(e);
        document.addEventListener('mousemove', secondHandler);
      });
      that.secondCalendar.getRoot().addEventListener('mousedown', function (e) {
        if (!e.target.date) {
          return false;
        }
        firstHandler(e);
        document.addEventListener('mousemove', firstHandler);
      });

      //adding mouseup listener
      document.addEventListener('mouseup', function (e) {
        if (!e.target.classList.contains('calendar-button')) {
          that.configMonthAndYear();
        }
        document.removeEventListener('mousemove', secondHandler);
      });
      document.addEventListener('mouseup', function (e) {
        if (!e.target.classList.contains('calendar-button')) {
          that.configMonthAndYear();
        }
        document.removeEventListener('mousemove', firstHandler);
      });

      //adding render listener
      that.firstCalendar.on('render', function () {
        that.selectFirstDays();
        that.selectSecondDays();
      });
      that.secondCalendar.on('render', function () {
        that.selectFirstDays();
        that.selectSecondDays();
      });

    }

    init.call(this);
  };
})(window, document);
