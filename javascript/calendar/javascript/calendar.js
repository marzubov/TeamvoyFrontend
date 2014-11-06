(function (global, document) {
  "use strict";
  /**
   * Creates calendar and inserts it in container
   * @param container - Place in the DOM where calendar will be inserted
   * @param properties - Optional. Config object, has such fields like: year, month, firstDayOfWeek, locale, output
   * @constructor
   */

  var Calendar = global.Calendar = function (container, properties) {
    Calendar.superclass.constructor.call(this);
    var calendar, root,
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
        dayEvents: [],
        weekends: ['SAT', 'SUN']
      };
    this.container = container;


    //TODO add today rendering
    this.showToday = function () {
      var today = moment();
      today.locale('en');
      config.month = today.get('month') + 1;
      config.year = today.get('year');
      render();
      var calendarBody = root.querySelector('.calendar-body');
      Array.prototype.slice.call(calendarBody.childNodes)
        .forEach(function (day) {
          console.log(moment().diff(day.date, 'days'));
          if (moment().diff(day.date, 'days') === 0) {
            day.classList.add('today');
          }
        });
      that.trigger('onDayChanged');
      return today;
    };

    /**
     * generating calendar model
     * @returns {{daysNames: Array, days: Array}}
     */
    function generateCalendar() {
      var i,
        date = moment([config.year, config.month - 1, 1]),
        maxDaysNumber = (1 + parseFloat(Math.ceil(30 / config.daysInWeek))) * config.daysInWeek;

      //resetting model
      model = {
        daysNames: [],
        days: [],
        currentMonth: ''
      };

      date.locale(config.locale).format('LLL');//change locale
      model.currentMonth = date.format('MMMM');//get current month

      //set calendar start date
      while (date.format('ddd').toLowerCase() != config.firstDayOfWeek.toLowerCase()) {
        date.subtract(1, 'days');
      }
      i = 0;

      //generating days array
      while (i < maxDaysNumber) {
        var isWeekend = false;
        config.weekends.map(function (day, i) {
          if (date.format('ddd').toLowerCase() == (day.toLowerCase())) {
            isWeekend = true;
          }
        });
        model.days.push({
          isInMonth: date.get('month') == (config.month - 1),
          isWeekend: isWeekend,
          date: date.clone()
        });
        date.add(1, 'days');
        i++;
      }

      i = 0;
      //generating days names array
      while (i < config.daysInWeek) {
        model.daysNames.push({
          name: model.days[i].date.format('ddd'),
          isWeekend: model.days[i].isWeekend.valueOf()
        });
        i++;
      }
      return model;
    }

    this.dayTemplate = function (day) {
      //here goes day template logic
      return day.toString();
    };

    /**
     * Getting day event
     * @param day
     * @returns {*}
     */
    this.getDayEvent = function (day) {
      return day;
    };

    /**
     * Get root element
     * @returns {Element}
     */
    this.getRoot = function () {
      return root;
    };

    /**
     * Adding selecting styles to the dates in range
     * @param styles
     * @param range
     * @returns {global.Calendar}
     */
    this.selectDays = function (range) {
      var calendarBody = root.querySelector('.calendar-body');
      Array.prototype.slice.call(calendarBody.childNodes)
        .forEach(function (day) {
          //styling selected days
          if (day.date.isAfter(range.start) && day.date.isBefore(range.end)) {
            day.classList.add('selected');
          }

          //styling start and end
          if (day.date.calendar() == range.start.calendar()) {
            day.classList.add('selected-start');
          }

          if (day.date.calendar() == range.end.calendar()) {
            day.classList.add('selected-end');
          }
        });
      return this;
    };

    //TODO set needed width while rendering
    this.renderCaption = function () {
      var captionElement = document.createElement('div');
      var tableString = '<button class="calendar-button desc"></button>'
        + '<span class="month-name">' + model.currentMonth.toString() + '</span>'
        + '<span class="year-name">' + config.year + '</span><button class="calendar-button asc"></button>';
      captionElement.innerHTML = tableString;
      captionElement.classList.add('calendar-caption');
      return captionElement;
    };

    this.renderHeader = function () {
      if (config.daysInWeek / 7 - Math.floor(config.daysInWeek / 7) != 0) return false;
      var headerElement = document.createElement('div');
      model.daysNames.map(function (dayName) {
        var dayNameElement = document.createElement('div');
        dayNameElement.dayName = dayName.name;
        dayNameElement.classList.add('day-name');
        if (dayName.isWeekend) {
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
      model.days.map(function (day) {
        var dayElement = document.createElement('div');
        dayElement.date = day.date;
        day.isInMonth ? dayElement.classList.add('day', 'in-month') : dayElement.classList.add('day', 'out-month');
        if (day.isWeekend) {
          dayElement.classList.add('weekend');
        }
        dayElement.innerHTML = that.dayTemplate(day.date.get('date'));
        bodyElement.appendChild(dayElement);
      });
      bodyElement.classList.add('calendar-body');
      return bodyElement;
    };

    function setEvents() {
      root
        .addEventListener('click', function (e) {
          if (e.target.classList.contains('calendar-button')) {
            e.target.classList.contains('asc') ? config.month++ : config.month--;
            if (config.month > 12) {
              config.year++;
              config.month = 1;
            }
            else if (config.month < 1) {
              config.year--;
              config.month = 12;
            }
            render();
            that.trigger('monthChanged', [config.month]);
            return true;
          }
          else if (e.target.date) {
            that.trigger('daySelected', [e]);
            return true;
          }
          return false;
        });
    }

    /**
     * Rendering
     */
    var render = this.render = function () {
      generateCalendar();

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

    /**
     * Initialize
     */
    function init() {

      //initializing elements
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

      render();

      //get set config
      Object.defineProperty(that, "config", {
        get: function () {
          return config;
        },
        set: function (value) {
          var propName;
          for (propName in value) {
            value[propName] = value[propName] ?
              value[propName] :
              config[propName];
          }
          if (value['month'] != config['month']) {
            that.trigger('onMonthChanged');
          }
          config.merge(value);
          render();
        }
      });

      setEvents();
      that.trigger('load', [this]);
      return this;
    }

    init();
  };
  Calendar.extend(EventMachine);
})(window, document);
