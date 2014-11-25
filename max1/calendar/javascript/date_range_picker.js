(function (global, document) {
  "use strict";
  /*global moment:true, EventMachine: true, Calendar:true, DateRangePicker:true, window:true, document:true, HTMLElement: true */
  global.DateRangePicker = function DateRangePicker(container, firstCalendarConfig, secondCalendarConfig, newRange) {
    EventMachine.call(this);
    moment.locale('en');
    var that = this,
      root = document.createElement('div'),
      range = {
        start: moment().startOf('day'),
        end: moment().startOf('day')
      };

    this.getRoot = function getRoot(){
      return root;
    };

    this.getRange = function () {
      return range;
    };

    this.changeRange = function changeRange(newRange){
      if (!newRange) {
        return range;
      }
      range = {
        start: moment(newRange.start).startOf('day') || range.start,
        end: moment(newRange.end).startOf('day') || range.end
      };
      that.configMonthAndYear();
      that.render();
      that.trigger('rangeChanged', [[range.start.clone()._d, range.end.clone()._d]]);
      return range;
    };

    this.render = function () {
      that.firstCalendar.render();
      that.secondCalendar.render();
      that.selectCalendarDays.call(that, that.firstCalendar);
      that.selectCalendarDays.call(that, that.secondCalendar);
    };

    this.configMonthAndYear = function () {
      that.firstCalendar.config = {month: range.start.get('month') + 1};
      that.secondCalendar.config = {month: range.end.get('month') + 1};
      that.firstCalendar.config = {year: range.start.get('year')};
      that.secondCalendar.config = {year: range.end.get('year')};
    };

    function setEvents(){

      function firstCalendarMouseMove(e){
        that.firstHandler.call(that, e);
      }

      function secondCalendarMouseMove(e){
        that.secondHandler.call(that, e);
      }

      that.firstCalendar.getRoot().addEventListener('mousedown', function (e) {
        if (!e.target.date) {
          return false;
        }
        that.secondHandler.call(that, e);
        document.addEventListener('mousemove', secondCalendarMouseMove);
      });

      that.secondCalendar.getRoot().addEventListener('mousedown', function (e) {
        if (!e.target.date) {
          return false;
        }
        that.firstHandler.call(that, e);
        document.addEventListener('mousemove', firstCalendarMouseMove);

      });

      //adding mouseup listener
      document.addEventListener('mouseup', function (e) {
        if (!e.target.classList.contains('calendar-button')) {
          that.configMonthAndYear();
        }
        that.selectCalendarDays.call(that, that.firstCalendar);
        that.selectCalendarDays.call(that, that.secondCalendar);

        document.removeEventListener('mousemove', firstCalendarMouseMove);
        document.removeEventListener('mousemove', secondCalendarMouseMove);
      });

      //adding render listener
      that.firstCalendar.on('render', function () {
        that.selectCalendarDays.call(that, that.firstCalendar);
        that.selectCalendarDays.call(that, that.secondCalendar);
      });

      that.secondCalendar.on('render', function () {
        that.selectCalendarDays.call(that, that.firstCalendar);
        that.selectCalendarDays.call(that, that.secondCalendar);
      });

      that.on('rangeChanged', function () {
        localStorage.setItem('dateRangePickerRange', JSON.stringify(that.getRange()));
      });
    }

    function init() {
      var newRange = JSON.parse(localStorage.getItem('dateRangePickerRange')) || newRange;

      that.firstCalendar = new Calendar(root, firstCalendarConfig);
      that.secondCalendar = new Calendar(root, secondCalendarConfig);

      range = that.changeRange(newRange);
      range.start.format('LLL');
      range.end.format('LLL');

      root.classList.add('date-range-picker');
      container.appendChild(root);



      that.firstCalendar.getRoot().classList.add('date-range-picker-first-calendar');
      that.secondCalendar.getRoot().classList.add('date-range-picker-second-calendar');

      that.selectCalendarDays.call(that, that.firstCalendar);
      that.selectCalendarDays.call(that, that.secondCalendar);

      setEvents();

      that.trigger('load', [that]);
    }

    init.call(this);
  };

  DateRangePicker.prototype.firstHandler = function firstHandler(e) {
    var range = this.getRange();
    e.preventDefault();

    if (!e.target.date) {
      return false;
    }

    var difference,
      selectedDate = moment(e.target.date);

    if (selectedDate.calendar() === range.end.calendar()) {
      return false;
    }
    if (selectedDate.isBefore(range.start)) {
      difference = range.end.diff(range.start);
      range.end = selectedDate.clone();
      range.start = range.end.clone().subtract(difference, 'milliseconds');
    }
    range.end = selectedDate.clone();
    this.render();
    this.trigger('rangeChanged', [[range.start.clone()._d, range.end.clone()._d]]);
  };

  DateRangePicker.prototype.secondHandler = function secondHandler(e) {
    var range = this.getRange();
    e.preventDefault();

    if (!e.target.date) {
      return false;
    }

    var difference,
      selectedDate = moment(e.target.date);

    if (selectedDate.calendar() === range.start.calendar()) {
      return false;
    }
    if (selectedDate.isAfter(range.end)) {
      difference = range.end.diff(range.start);
      range.start = selectedDate.clone();
      range.end = range.start.clone().add(difference, 'milliseconds');
    }
    range.start = selectedDate.clone();
    this.render();
    this.trigger('rangeChanged', [[range.start.clone()._d, range.end.clone()._d]]);
  };

  DateRangePicker.prototype.selectCalendarDays = function selectCalendarDays(calendar) {
    var momentDate,
      calendarBody = calendar.getRoot().querySelector('.calendar-body'),
      range = this.getRange();
    Array.prototype.slice.call(calendarBody.childNodes)
      .forEach(function (day) {
        momentDate = moment(day.date);

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

})(window, document);
