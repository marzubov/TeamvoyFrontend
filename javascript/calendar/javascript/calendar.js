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
        //default values
        year: (new Date()).getFullYear(),
        month: (new Date()).getMonth() + 1,
        firstDayOfWeek: 'SUN',
        locale: 'en',
        daysInWeek: 7,
        dayEvents: [{date: moment([2014, 10, 10])}],
        weekends: ['Sat', 'Sun']
      },
      backupConfig = {};
    this.container = container;

    /**
     * Get root element
     * @returns {element}
     */
    this.getRoot = function () {
      return root;
    };

    this.goToMonth = function (month) {

      //config.month is represented as number from 1 to 12
      //all operations with date validation are easier if month is represented
      //from 0 to 11, that's why we decrease month parameter at start
      month = month - 1;
      if (month >= 0) {
        config.month = month % 12 + 1;
        config.year = parseFloat(config.year) + Math.floor(month / 12);
      } else {
        config.month = 13 + month % 12;
        config.year = config.year - Math.ceil(-month / 12);
      }
    };

    /**
     * Calls rendering of all calendar parts
     * and appends result to needed elements
     * @returns {global.Calendar}
     */
    this.render = function () {

      //render elements of calendar and replace already existing containers
      root.querySelector('.calendar-caption').parentNode
        .replaceChild(that.renderCaption(config, model), root.querySelector('.calendar-caption'));
      root.querySelector('.calendar-header').parentNode
        .replaceChild(that.renderHeader(config, model), root.querySelector('.calendar-header'));
      root.querySelector('.calendar-body').parentNode
        .replaceChild(that.renderBody(model), root.querySelector('.calendar-body'));
      that.trigger('render');
      return that;
    };

    /**
     * Calls generateModel and if the last was successful renders calendar
     * else resets config to backupConfig
     */
    function generateAndRender() {
      var newModel = that.generateModel(config);
      if (typeof newModel === "object") {
        model = newModel;
        that.render();
        backupConfig.merge(config);
      } else {//if was error in generating model
        config = backupConfig;
      }
    }

    /**
     * Sets config month and year to today's month and year
     * then generates and renders new data and searches for today's day
     * @returns {Date}
     */
    this.showToday = function () {

      //gets moment js today object, finds day with same date attribute
      //and adds 'today' class
      var dayDate,
        today = moment().locale(config.locale);
      config.month = today.get('month') + 1;
      config.year = today.get('year');
      generateAndRender();
      Array.prototype.slice.call(root.querySelector('.calendar-body').childNodes)
        .some(function (day) {
          dayDate = moment(day.date).locale(config.locale);
          if (today.diff(dayDate, 'days') === 0) {
            return !day.classList.add('today');
          }
        });
      return today._d;
    };

    /**
     * Setting all needed calendar events:
     * monthChanged, daySelected
     */
    function setEvents() {
      root
        .addEventListener('click', function (e) {
          if (e.target.classList.contains('calendar-button')) {

            //checking what type of button was clicked
            if (e.target.classList.contains('asc')) {
              that.goToMonth(config.month.valueOf() + 1);
            } else {
              that.goToMonth(config.month.valueOf() - 1);
            }
            that.trigger('monthChanged', [config.month]);
            generateAndRender();
          } else if (e.target.date) {
            that.trigger('daySelected', [e.target.date]);
          }
        });
    }

    /**
     * Creating all needed dom elements:
     * root, caption, header, body
     */
    this.createElements = function () {

      //creating root element and all calendar main parts
      root = document.createElement('div');
      root.classList.add('calendar');
      var caption = document.createElement('div'),
        header = document.createElement('div'),
        body = document.createElement('div');
      caption.classList.add('calendar-caption');
      header.classList.add('calendar-header');
      body.classList.add('calendar-body');
      root.appendChild(caption);
      root.appendChild(header);
      root.appendChild(body);
      container.appendChild(root);
    };

    /**
     * Initializing calendar
     * @returns {global.Calendar}
     */
    function init() {
      that.createElements();
      config.merge(properties);

      generateAndRender();

      //get set config
      Object.defineProperty(that, "config", {
        get: function () {
          return config;
        },
        set: function (value) {
          var propName;
          for (propName in value) {
            if (that.config.hasOwnProperty(propName)) {
              value[propName] = value[propName] ? value[propName] : config[propName];
              if (value['month'] !== config['month']) {
                that.trigger('monthChanged');
              }
              config.merge(value);
              generateAndRender();
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

  /**
   * Gets first day of the calendar from config
   * @param config
   * @returns {*}
   */
  function getFirstDate(config) {
    var date = moment([config.year, config.month - 1, 1]).locale('en');

    return date.isAfter(date.clone().day(config.firstDayOfWeek)) ?
      date.day(config.firstDayOfWeek) :
      date.day(config.firstDayOfWeek).subtract(7, 'days');
  }

  /**
   * Function for generating array of days from moment js date, count and config
   * @param date
   * @param count
   * @param config
   * @returns {Array}
   */
  function getDaysArray(date, count, config) {
    return Array.apply(null, {length: count})
      .map(function (el, i) {
        var currentDayName = date.clone().locale('en').format('ddd'),
          day = {
            isInMonth: date.get('month') === (config.month - 1),
            isWeekend: (config.weekends.indexOf(currentDayName) !== -1),
            date: date.clone()._d
          };
        date.add(1, 'days');
        return day;
      });
  }

  /**
   * Function for generating array of days names from moment js date and config
   * @param date
   * @param config
   * @returns {Array}
   */
  function getDaysNamesArray(date, config) {
    return Array.apply(null, {length: config.daysInWeek})
      .map(function (el, i) {
        var currentDayName = date.clone().locale('en').format('ddd'),
          dayName = {
            name: date.format('ddd'),
            isWeekend: (config.weekends.indexOf(currentDayName) !== -1)
          };
        date.add(1, 'days');
        return dayName;
      });
  }

  /**
   * Day template
   * @param day
   * @returns {string|*}
   */
  Calendar.prototype.dayTemplate = function (day) {
    return day.toString();
  };

  /**
   * Generating calendar
   * @param config
   * @returns {number/Object} - if success returns model object,
   * else triggers on error and returns error number from 0 to 6
   * (0-error in day, 1-month, 2-year, ...)
   */
  Calendar.prototype.generateModel = function (config) {
    var date = getFirstDate(config).locale(config.locale),
      model = {},
      maxDaysNumber = (1 + parseFloat(Math.ceil(30 / config.daysInWeek))) * config.daysInWeek;
    if (!date.isValid()) {
      this.trigger('dateValidation', [date.invalidAt()]);
      return date.invalidAt();
    }
    model.daysNames = getDaysNamesArray(date, config);
    model.currentMonth = date.format('MMMM');
    date.subtract(config.daysInWeek, 'days');
    model.days = getDaysArray(date, maxDaysNumber, config);
    return model;
  };

  /**
   * Rendering caption
   * @param config
   * @param model
   * @returns {HTMLElement}
   */
  Calendar.prototype.renderCaption = function (config, model) {
    var captionElement = document.createElement('div');
    captionElement.innerHTML = '<button class="calendar-button desc"></button>'
    + '<span class="month-name">' + model.currentMonth.toString() + '</span>'
    + '<span class="year-name">' + config.year + '</span><button class="calendar-button asc"></button>';
    captionElement.classList.add('calendar-caption');
    return captionElement;
  };

  /**
   * Rendering header
   * @param config
   * @param model
   * @returns {bool/HTMLElement} - if success returns header HTMLElement
   * else returns false if count days in week isn't multiply of 7
   *
   */
  Calendar.prototype.renderHeader = function (config, model) {
    if (config.daysInWeek / 7 - Math.floor(config.daysInWeek / 7) !== 0) {
      return false;
    }
    var headerElement = document.createElement('div');
    model.daysNames.map(function (dayName) {
      var dayNameElement = document.createElement('div');
      dayNameElement.dayName = dayName.name;
      dayNameElement.classList.add('day-name');
      if (dayName.isWeekend) {
        dayNameElement.classList.add('weekend');
      }
      dayNameElement.innerHTML = dayName.name;
      headerElement.appendChild(dayNameElement);
    });
    headerElement.classList.add('calendar-header');
    return headerElement;
  };

  /**
   * Rendering body
   * @param model
   * @returns {HTMLElement}
   */
  Calendar.prototype.renderBody = function (model) {
    var dayTemplate,
      that = this,
      bodyElement = document.createElement('div');
    bodyElement.classList.add('calendar-body');

    model.days.forEach(function (day) {
      var dayElement = document.createElement('div');
      dayElement.date = day.date;
      if (day.isInMonth) {
        dayElement.classList.add('day', 'in-month');
      } else {
        dayElement.classList.add('day', 'out-month');
      }
      if (day.isWeekend) {
        dayElement.classList.add('weekend');
      }
      dayTemplate = that.dayTemplate(day.date.getDate());
      if (dayTemplate instanceof HTMLElement) {
        dayElement.appendChild(dayTemplate);
      } else if (typeof dayTemplate === "string") {
        dayElement.innerHTML = dayTemplate;
      } else {
        dayElement.innerHTML = day.date.getDate().toString();
      }
      bodyElement.appendChild(dayElement);
    });
    return bodyElement;
  };

})(window, document);
