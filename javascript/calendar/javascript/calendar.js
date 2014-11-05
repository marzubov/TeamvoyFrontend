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

    /**
     * Show current day in calendar
     */
    this.showToday = function () {
      var today = new Date((new Date()).setHours(0, 0, 0, 0));
      config.month = today.getMonth() + 1;
      config.year = today.getFullYear();
      render();
      //TODO add today rendering
      that.trigger('onDayChanged');
      return today;
    };

    /**
     * generating calendar model
     * @returns {{daysNames: Array, days: Array}}
     */
    function generateCalendar() {//TODO use moment.js
      var i,
        date = moment([config.year, config.month - 1, 1]),
        maxDaysNumber = (1 + parseFloat(Math.ceil(30 / config.daysInWeek))) * config.daysInWeek;

      model = {
        daysNames: [],
        days: [],
        currentMonth: ''
      };
      date.locale(config.locale).format('LLL');
      model.currentMonth = date.format('MMMM');
      while (date.format('ddd').toLowerCase() != config.firstDayOfWeek.toLowerCase()) {
        date.subtract(1, 'days');
      }
      i = 0;

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
      var _dayEvents = {};
      Array.prototype.slice.call(config.dayEvents)
        .forEach(function (dayEvent) {
          if (dayEvent[day]) {
            _dayEvents = dayEvent[day];
          }
        });
      return _dayEvents;
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
      //TODO update selecting days
    this.selectDays = function (styles, range) {
      styles = styles || 'selected';
      rowsForEach(that.getRoot().rows, function (cell) {
        var currentDate = new Date(parseFloat(cell.getAttribute('year'))
          , parseFloat(cell.getAttribute('month')) - 1, parseFloat(cell.getAttribute('day-number')));
        if ((range.start.getTime() <= currentDate.getTime()) && (currentDate.getTime() <= range.end.getTime())) {
          cell.classList.add(styles);
        }
      });
      return this;
    };

    /**
     *
     * @returns {HTMLElement}
     */

      //TODO render divs not table
    this.renderCaption = function () {
      var captionElement = document.createElement('div');
      var tableString = '<button class="calendar-button desc"></button>'
        + '<span class="month-name">' + model.currentMonth.toString() + '</span>'
        + '<span class="year-name">' + config.year + '</span><button class="calendar-button asc"></button>';
      captionElement.innerHTML = tableString;
      captionElement.classList.add('calendar-caption');
      return captionElement;
    };

    /**
     *
     * @returns {HTMLElement}
     */
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

    /**
     *
     * @returns {HTMLElement}
     */
    this.renderBody = function () {
      var bodyElement = document.createElement('div');
      model.days.map(function (day) {
        var dayElement = document.createElement('div');
        dayElement.data = day.date;
        day.isInMonth ? dayElement.classList.add('day', 'in-month') : dayElement.classList.add('day', 'out-month');
        //if (day.isInMonth){
        //  dayElement.classList.add('day', 'in-month');
        //}else{
        //  dayElement.classList.add('day', 'out-month');
        //}
        if (day.isWeekend) {
          dayElement.classList.add('weekend');
        }
        dayElement.innerHTML = that.dayTemplate(day.date.get('date'));
        bodyElement.appendChild(dayElement);
      });
      bodyElement.classList.add('calendar-body');
      return bodyElement;
    }

    /**
     * Setting events on table
     */
    function setEvents() {//TODO remove unnecessary code
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
            that.trigger('onMonthChanged', [e]);
            return true;
          }
          else if (e.target != this) {
            that.trigger('onDayChanged', [e]);
            return true;
          }
          return false;
        });

      root.addEventListener('mousedown', function (e) {
        if ((e.target.classList.contains('out-month'))
          || (e.target.classList.contains('in-month'))) {
          that.trigger('onMouseDown', [e]);
        }
      });

      root.addEventListener('mousemove', function (e) {
        if ((e.target.classList.contains('out-month'))
          || (e.target.classList.contains('in-month'))) {
          that.trigger('onMouseMove', [e]);
          e.preventDefault();
        }
      });

      root.addEventListener('mouseup', function (e) {
        if ((e.target.classList.contains('out-month'))
          || (e.target.classList.contains('in-month'))) {
          that.trigger('onMouseUp', [e]);
        }
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
      root.classList.add('calendar');

      return this;
    };

    /**
     * Initialize
     */
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
      render();
      that.trigger('onLoad', [this]);
      container.appendChild(root);
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

      config.merge(properties);

      setEvents();
      return this;
    }

    init();
  };
  Calendar.extend(EventMachine);
})(window, document);
