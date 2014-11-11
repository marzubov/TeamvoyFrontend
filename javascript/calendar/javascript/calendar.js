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

    this.showToday = function () {

      //gets moment js today object, finds day with same date attribute
      //and adds 'today' class
      var dayDate,
        today = moment().locale(config.locale);
      that.render();
      Array.prototype.slice.call(root.querySelector('.calendar-body').childNodes)
        .some(function (day) {
          dayDate = moment(day.date).locale(config.locale);
          if (today.diff(dayDate, 'days') === 0) {
            return !day.classList.add('today');
          }
        });
      return today;
    };

    /**
     * Getting event of date
     * @param date
     * @returns {Array}
     */
    this.getDayEvent = function (date) {

      //finds day events with same date in config.dayEvents array,
      //and returns array of found day events
      return config.dayEvents.map(function (dayEvent) {
        if (dayEvent.date.calendar() == date.calendar()) {
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

    this.goToMonth = function (month){
      month--;
      console.log(month);
      if (month>=0){
        console.log(month, month%12 + 1, Math.floor(month/12) );
        config.month = month%12 + 1;
        config.year = parseFloat(config.year) + Math.floor(month/12);
      } else{
        config.month = (month+12)%12 + 1;
        config.year = parseFloat(config.year) + Math.floor(month/12);
      }
    };

    this.render = function () {

      //render elements of calendar and replace already existing containers
      root.querySelector('.calendar-caption').parentNode
        .replaceChild(that.renderCaption(config, model), root.querySelector('.calendar-caption'));
      root.querySelector('.calendar-header').parentNode
        .replaceChild(that.renderHeader(config, model), root.querySelector('.calendar-header'))
      root.querySelector('.calendar-body').parentNode
        .replaceChild(that.renderBody(config, model), root.querySelector('.calendar-body'));
      that.trigger('render');
      return that;
    };

    function generateAndRender(){
      var newModel = that.generateCalendar(config);
      if (typeof newModel == "object") {
        model = newModel;
        that.render();
        backupConfig.merge(config);
      } else{//if was error in generating model
        config = backupConfig;
      }
    }

    function setEvents() {
      root
        .addEventListener('click', function (e) {
          if (e.target.classList.contains('calendar-button')) {

            //checking what type of button was clicked
            if (e.target.classList.contains('asc')) {
              that.goToMonth(config.month.valueOf()+1);
            } else {
              that.goToMonth(config.month.valueOf()-1);
            }
            that.trigger('monthChanged', [config.month]);
            generateAndRender();
          }
          else if (e.target.date) {
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
          for (var propName in value)
            if (that.config.hasOwnProperty(propName)) {
              value[propName] = value[propName] ? value[propName] : config[propName];
              if (value['month'] != config['month']) that.trigger('monthChanged');
              config.merge(value);
              generateAndRender();
            }
        }
      });
      setEvents();
      that.trigger('load', [that]);
      return that;
    }
    init();
  };

  function getFirstDate(config) {
    var date = moment([config.year, config.month - 1, 1]).locale('en');

    return date.isAfter(date.clone().day(config.firstDayOfWeek)) ?
      date.day(config.firstDayOfWeek) :
      date.day(config.firstDayOfWeek).subtract(7, 'days');
  }

  function getDaysArray(date, count, config) {
    return Array.apply(null, {length: count})
      .map(function (el, i) {
        var currentDayName = date.clone().locale('en').format('ddd');
        var day = {
          isInMonth: date.get('month') == (config.month - 1),
          isWeekend: (config.weekends.indexOf(currentDayName) != -1),
          date: date.clone()._d
        };
        date.add(1, 'days');
        return day;
      });
  }

  function getDaysNamesArray(date, config) {
    return Array.apply(null, {length: config.daysInWeek})
      .map(function (el, i) {
        var currentDayName = date.clone().locale('en').format('ddd');
        var dayName = {
          name: date.format('ddd'),
          isWeekend: (config.weekends.indexOf(currentDayName) != -1)
        };
        date.add(1, 'days');
        return dayName;
      });
  }

  Calendar.prototype.dayTemplate = function (day) {
    return day.toString();
  };

  Calendar.prototype.generateCalendar = function (config) {
    var date = getFirstDate(config),
      model = {},
      maxDaysNumber = (1 + parseFloat(Math.ceil(30 / config.daysInWeek))) * config.daysInWeek;
    date.locale(config.locale);
    if (!date.isValid()) {
      console.log('Date generation error:', date.invalidAt());
      this.trigger('dateValidation', [date.invalidAt()]);
      return date.invalidAt();
    }
    model.daysNames = getDaysNamesArray(date, config);
    model.currentMonth = date.format('MMMM');
    date.subtract(config.daysInWeek, 'days');
    model.days = getDaysArray(date, maxDaysNumber, config);
    return model;
  };

  Calendar.prototype.renderCaption = function (config, model) {
    var captionElement = document.createElement('div');
    captionElement.innerHTML = '<button class="calendar-button desc"></button>'
    + '<span class="month-name">' + model.currentMonth.toString() + '</span>'
    + '<span class="year-name">' + config.year + '</span><button class="calendar-button asc"></button>';
    captionElement.classList.add('calendar-caption');
    return captionElement;
  };

  Calendar.prototype.renderHeader = function (config, model) {
    if (config.daysInWeek / 7 - Math.floor(config.daysInWeek / 7) != 0) {
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

  Calendar.prototype.renderBody = function (config, model) {
    var that = this,
     bodyElement = document.createElement('div');
    bodyElement.classList.add('calendar-body');

    model.days.map(function (day) {
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
      var dayTemplate = that.dayTemplate(day.date.getDate());
      try {
        dayElement.appendChild(dayTemplate);
      }
      catch (e) {
        dayElement.innerHTML = dayTemplate;
      }
      bodyElement.appendChild(dayElement);
    });
    return bodyElement;
  };

})(window, document);
