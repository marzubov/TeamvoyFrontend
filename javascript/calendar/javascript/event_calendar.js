(function (global, document) {
  "use strict";

  var EventCalendar = global.EventCalendar = function(container){
    EventMachine.call(this);
    moment.locale('en');
    var that = this;
    this.calendar = new Calendar(container, {});

    /**
     * Getting event of date
     * @param date
     * @returns {Array}
     */


    function setEvents(){
      that.calendar.on('daySelected', function (day){
        that.showEvents.call(that,day);
      });
      console.log('binded');
    }

    function init(){
      var popup = document.createElement('div');
      popup.classList.add('events-popup', 'non-active');
      that.calendar.getRoot().appendChild(popup);
      setEvents();
      that.trigger('load', [that]);
    }

    init();

    return this;

  };

  EventCalendar.prototype.dayEvents = [{date: moment([2014, 10, 10])._d, name:"eventName"}];

  EventCalendar.prototype.getDayEvents = function (date) {

    //finds day events with same date in config.dayEvents array,
    //and returns array of found day events
    return this.dayEvents.map(function (dayEvent) {
      if (dayEvent.date == date) {
        return dayEvent;
      }
    });
  };

  /**
   *
   * @param events
   * @returns {HTMLElement}
   */
  EventCalendar.prototype.eventsTemplate = function (events){
    var eventsElement = document.createElement('div');
    eventsElement.classList.add('events');
    Array.prototype.slice.call(events)
      .forEach(function (dayEvent) {
        if (dayEvent)
        eventsElement.innerHTML+=dayEvent.name;
      });
    return eventsElement;
  };

  /**
   *
   * @param events
   * @param dayElement
   */
  EventCalendar.prototype.renderPopup = function (events, dayElement) {
    var dayElementPos = findPos(dayElement),
      popup = this.calendar.getRoot().querySelector('.events-popup');
    console.log(popup, dayElementPos);
    popup.style.left = dayElementPos.left.toString() + 'px';
    popup.style.top = dayElementPos.top.toString() + 'px';

    var eventsTemplate = this.eventsTemplate(events);
    if (eventsTemplate instanceof HTMLElement) {
      popup.appendChild(eventsTemplate);
    } else if (typeof eventsTemplate == "string") {
      popup.innerHTML = eventsTemplate;
    } else {
      popup.innerHTML = events.toString();
    }
  };

  /**
   *
   * @param date
   */
  EventCalendar.prototype.showEvents = function (date) {
    console.log(date);
    console.log(this);
    var selectedDay,
      events = this.getDayEvents(date);
    Array.prototype.slice.call(this.calendar.getRoot().querySelector('.calendar-body').childNodes)
      .some(function (day) {
        if (date == day.date) {
          selectedDay = day;
          return true;
        }
      });
    if (selectedDay) {
      this.renderPopup(events, selectedDay);
      this.calendar.getRoot().querySelector('.events-popup')
        .classList.remove('non-active');
      this.calendar.getRoot().querySelector('.events-popup')
        .classList.add('active');
    }
  };


})(window, document);
