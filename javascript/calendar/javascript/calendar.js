(function (global, document) {
  "use strict";
  /**
   * Creates calendar and inserts it in container
   * @param container - Place in the DOM where calendar will be inserted
   * @param properties - Optional. Config object, has such fields like: year, month, firstDayOfWeek, locale, output
   * @constructor
   */

  var Calendar = global.Calendar = function (container, properties) {
    EventMachine.call(this);
    var root,
      that = this,
      model = {
        daysNames: [],
        days: [],
        currentMonth: ''
      },
      config = {
        year: (new Date()).getFullYear(),
        month: (new Date()).getMonth() + 1,
        firstDayOfWeek: 'SUN',
        locale: 'en',
        daysInWeek: 7,
        dayEvents: [{date: moment([2014,10,10])}],
        weekends: ['Sat', 'Sun']
      };
    this.container = container;

    this.showToday = function () {
      var today = moment();
      today.locale(config.locale);
      config.month = today.get('month') + 1;
      config.year = today.get('year');
      render();
      Array.prototype.slice.call(root.querySelector('.calendar-body').childNodes)
        .some(function (day) {
          if (moment().diff(day.date, 'days') === 0) return !day.classList.add('today');
        });
      return today;
    };

    /**
     * generating calendar model
     * @returns {{daysNames: Array, days: Array}}
     */
    var generateCalendar = this.generateCalendar = function () {
      var date = moment([config.year, config.month - 1, 1]),
        maxDaysNumber = (1 + parseFloat(Math.ceil(30 / config.daysInWeek))) * config.daysInWeek;

      date.locale(config.locale).day(config.firstDayOfWeek);//change to config locale

      //moment js validation
      if (!date.isValid()){
        console.log(date.invalidAt());
        that.trigger('dateValidation', [date.invalidAt()]);
        return date.invalidAt();
      }

      //generate day names
      model.daysNames = Array.apply(null, {length: config.daysInWeek}).map(function (el, i) {
        var dayName = {
          name: date.format('ddd'),
          isWeekend: (config.weekends.indexOf(date.clone().locale('en').format('ddd')) != -1)
        };
        date.add(1,'days');
        return dayName;
      });

      model.currentMonth = date.format('MMMM');//get current month
      date.subtract(config.daysInWeek, 'days');//setting date to month start position

      model.days = Array.apply(null, {length: maxDaysNumber}).map(function (el, i) {
        var day = {
          isInMonth: date.get('month') == (config.month - 1),
          isWeekend: (config.weekends.indexOf(date.clone().locale('en').format('ddd')) != -1),
          date: date.clone()._d //getting Date() from moment object
        };
        date.add(1,'days');//setting date to next day
        return day;
      });
      return date.invalidAt(); //returns -1 if success
    };

    this.dayTemplate = function (day) {
      //here goes day template logic
      return day.toString();
    };

    /**
     * Getting event of date
     * @param date
     * @returns {Array}
     */
    this.getDayEvent = function (date) {
      return config.dayEvents.map(function (dayEvent){
        if (dayEvent.date.calendar() == date.calendar()){
          return dayEvent;
        }
      });
    };

    /**
     * Get root element
     * @returns {element}
     */
    this.getRoot = function () {
      return root;
    };

    this.renderCaption = function () {
      var captionElement = document.createElement('div');
      captionElement.innerHTML = '<button class="calendar-button desc"></button>'
      + '<span class="month-name">' + model.currentMonth.toString() + '</span>'
      + '<span class="year-name">' + config.year + '</span><button class="calendar-button asc"></button>';
      captionElement.classList.add('calendar-caption');
      return captionElement;
    };

    this.renderHeader = function () {
      if (config.daysInWeek / 7 - Math.floor(config.daysInWeek / 7) != 0) {
        return false;
      }

      var headerElement = document.createElement('div');
      model.daysNames.map(function (dayName) {

        var dayNameElement = document.createElement('div');
        dayNameElement.dayName = dayName.name;
        dayNameElement.classList.add('day-name');

        if (dayName.isWeekend){
          dayNameElement.classList.add('weekend');
        }

        dayNameElement.innerHTML = that.dayTemplate(dayName.name);
        headerElement.appendChild(dayNameElement);
      });
      headerElement.classList.add('calendar-header');
      return headerElement;
    };

    this.renderBody = function () {
      var bodyElement = document.createElement('div');
      bodyElement.classList.add('calendar-body');
      model.days.map(function (day) {
        var dayElement = document.createElement('div');
        dayElement.date = day.date;

        if (day.isInMonth){
          dayElement.classList.add('day', 'in-month');
        } else {
          dayElement.classList.add('day', 'out-month');
        }

        if (day.isWeekend) {
          dayElement.classList.add('weekend');
        }

        dayElement.innerHTML = that.dayTemplate(day.date.getDate());
        bodyElement.appendChild(dayElement);
      });
      return bodyElement;
    };

    this.previousMonth = function(){
      config.month--;
      if (config.month < 1){
        config.month = 12;
        config.year --;
      }
    };

    this.nextMonth = function(){
      config.month++;
      if (config.month > 12){
        config.month = 1;
        config.year ++;
      }
    };

    function setEvents() {
      root
        .addEventListener('click', function (e) {
          if (e.target.classList.contains('calendar-button')) {
            var currentMonth = config.month.valueOf(),
              currentYear = config.year.valueOf();
            if (e.target.classList.contains('asc')){
              that.nextMonth();
            } else{
              that.previousMonth();
            }
            that.trigger('monthChanged', [e, config.month]);
            if (generateCalendar() != -1){
              config.month = currentMonth;
              config.year = currentYear;
              return false;
            }

            render();
          }
          else if (e.target.date) {
            that.trigger('daySelected', [e, e.target.date]);
          }
        });
    }

    var render = this.render = function () {

      //render elements of calendar and replace already existing containers
      root.querySelector('.calendar-caption').parentNode
        .replaceChild(that.renderCaption(), root.querySelector('.calendar-caption'));

      root.querySelector('.calendar-header').parentNode
        .replaceChild(that.renderHeader(), root.querySelector('.calendar-header'));

      root.querySelector('.calendar-body').parentNode
        .replaceChild(that.renderBody(), root.querySelector('.calendar-body'));

      that.trigger('render');
      return this;
    };

    function init() {
      root = document.createElement('div');
      var caption = document.createElement('div'),
        header = document.createElement('div'),
        body = document.createElement('div');
      caption.classList.add('calendar-caption');
      header.classList.add('calendar-header');
      body.classList.add('calendar-body');
      root.appendChild(caption);
      root.appendChild(header);
      root.appendChild(body);
      root.classList.add('calendar');

      container.appendChild(root);

      config.merge(properties);

      if (generateCalendar() == -1){
       render();
      }

      //get set config
      Object.defineProperty(that, "config", {
        get: function () {
          return config;
        },
        set: function (value) {
          for (var propName in value)
            if (that.config.hasOwnProperty(propName)) {
              value[propName] = value[propName] ? value[propName] : config[propName];
              if (value['month'] != config['month']) that.trigger('monthChanged');
              config.merge(value);
              if (generateCalendar() == -1){
                render();
              }
            }
        }
      });

      setEvents();
      that.trigger('load', [that]);
      return that;
    }

    init();
  };
})(window, document);
