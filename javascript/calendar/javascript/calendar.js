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
      model = {},
      config = {
        year: (new Date()).getFullYear(),
        month: (new Date()).getMonth() + 1,
        firstDayOfWeek: 'SUN',
        locale: 'en',
        daysInWeek: 7,
        dayEvents: [],
        weekends: ['SAT', 'SUN']
      };
    Calendar.localizationCache = {};
    this.container = container;
    init();

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
     * Generating calendar
     * @returns {global.Calendar.generateCalendar}
     */
    function generateCalendar() {//TODO use moment.js
      var i, date = new Date(config.year, config.month - 1), month, monthPrefix,
        lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
        firstDayWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
        indexOfStartDay, days = [],
        maxDaysNumber = (1 + parseFloat(Math.ceil(30 / config.daysInWeek))) * config.daysInWeek,
        myMonth = Object.keys(Calendar.localizationCache[config.locale].month).map(function (key, index) {
          return Calendar.localizationCache[config.locale].month[key];
        }),
        myDays = Object.keys(Calendar.localizationCache[config.locale].daysOfWeek).map(function (key, index) {
          return Calendar.localizationCache[config.locale].daysOfWeek[key];
        });

      indexOfStartDay = myDays.indexOf(config.firstDayOfWeek);
      model.chosenMonth = myMonth[config.month - 1];

      myDays.forEach(function (el, i) {
        days[i] = el;
      });

      model.arrayOfDays = [];
      days = days.slice(indexOfStartDay, config.daysInWeek).concat(days.slice(0, indexOfStartDay));
      model.arrayOfDays.push(days);

      month = Array.apply(null, {length: lastDay}).map(function (el, i) {
        return i + 1;
      });

      firstDayWeek = (config.daysInWeek - (indexOfStartDay + 1 - firstDayWeek)) % config.daysInWeek;
      monthPrefix = new Array(firstDayWeek);
      month = monthPrefix.concat(month);
      month = month.concat(new Array(maxDaysNumber - month.length));

      for (i = 0; i < month.length; i += config.daysInWeek) {
        model.arrayOfDays.push(month.slice(i, i + config.daysInWeek));
      }
      return this;
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
    }

    /**
     *
     * @returns {HTMLElement}
     */

      //TODO render divs not table
    this.renderCaption = function () {
      var captionElement = document.createElement('div');
      var tableString = '<button class="calendar-button desc"></button>'
        + '<span class="month-name">' + model.chosenMonth + '</span>'
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
      var headerElement = document.createElement('div'),
        weekNumber = 0,
        tableString = '';
      for (var i = 0; i < config.daysInWeek; i++) {
        weekNumber = Math.floor(i / 7);
        tableString += '<div day-name = ' + model.arrayOfDays[0][i - weekNumber * 7].toString() + ' class="day-name">' + model.arrayOfDays[0][i - weekNumber * 7].toString() + '</div>';
      }
      headerElement.innerHTML += tableString;
      headerElement.classList.add('calendar-header');
      return headerElement;
    };

    /**
     *
     * @returns {HTMLElement}
     */
    this.renderBody = function () {
      var tableString = '',
        i = 0, newMonthDay = 1,
        date = new Date(config.year, config.month - 2),
        lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
        firstDayWeek = new Date(date.getFullYear(), date.getMonth() + 1, 1).getDay(),
        bodyElement = document.createElement('div');
      var weekNumber = 0;
      model.arrayOfDays.map(function (week) {

        if (weekNumber == 0) {
          weekNumber++;
          return false;
        }
        for (i = 0; i < config.daysInWeek; i++) {
          var year = config.year.valueOf();
          var month = config.month.valueOf();
          var dayElement = document.createElement('div');
          dayElement.classList.add('day');
          if (week[i]) {
            dayElement.setAttributes({
              'year': year.toString(),
              'month': month.toString(),
              'day-number': week[i].toString(),
              'html': that.dayTemplate(week[i])
            });
            dayElement.classList.add('in-month');
          }
          else {
            if (weekNumber == 1) {

              if (config.month == 1) {
                year--;
                month = 13;
              }
              dayElement.setAttributes({
                'year': year.toString(),
                'month': (month - 1).toString(),
                'day-number': (lastDay - firstDayWeek + 1 - config.daysInWeek + 7).toString(),
                'html': that.dayTemplate(lastDay - firstDayWeek + 1 - config.daysInWeek + 7)
              });
              dayElement.classList.add('out-month');
              firstDayWeek--;
            } else {
              if (config.month == 12) {
                year++;
                month = 0;
              }
              dayElement.setAttributes({
                'year': year.toString(),
                'month': (month + 1).toString(),
                'day-number': (newMonthDay).toString(),
                'html': that.dayTemplate(newMonthDay)
              });
              dayElement.classList.add('out-month');
              newMonthDay++;
            }
          }
          bodyElement.appendChild(dayElement);
        }
        weekNumber++;
      });
      bodyElement.classList.add('calendar-body');
      return bodyElement;
    };

    /**
     * Ajax request to get localization
     * @returns {XMLHttpRequest}
     */
    function getLocalization() {
      var xhr = new XMLHttpRequest();
      Calendar.localizationCache[config.locale] = XMLHttpRequest;
      xhr.open("GET", "localization/" + config.locale + ".json", true);
      xhr.send(null);
      return xhr;
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
      console.log(caption);

      root.appendChild(caption);
      root.appendChild(header);
      root.appendChild(body);
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
      if (!Calendar.localizationCache[config.locale]) {
        getLocalization()
          .onload = function () {
          Calendar.localizationCache[config.locale] = JSON.parse(this.responseText);
          render();
          that.trigger('onLoad', [this]);
          container.appendChild(root);
        };
      }
      setEvents();
      return this;
    }
  };
  Calendar.extend(EventMachine);
})(window, document);
