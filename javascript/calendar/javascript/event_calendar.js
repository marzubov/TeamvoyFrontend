(function (global, document) {
  "use strict";
  /*global moment:true, EventMachine: true, Calendar:true, EventCalendar:true,
   window:true, document:true, HTMLElement: true */
  global.EventCalendar = function EventCalendar(container) {
    EventMachine.call(this);
    var that = this;
    this.calendar = new Calendar(container, {});

    function setEvents() {
      that.calendar.on('daySelected', function (day) {
        that.showEvents.call(that, day);
      });
      document.addEventListener('click', function (e) {
        if ((e.target !== that.calendar.getRoot()) && (!that.calendar.getRoot().contains(e.target))) {
          that.calendar.getRoot().querySelector('.events-popup')
            .classList.remove('active');
          that.calendar.getRoot().querySelector('.events-popup')
            .classList.add('non-active');
        }
      });
    }

    function init() {
      var popup = document.createElement('div');
      popup.classList.add('events-popup', 'non-active');
      that.calendar.getRoot().appendChild(popup);
      setEvents();
      that.trigger('load', [that]);
    }

    init();

    return this;

  };

  EventCalendar.prototype.dayEvents = [{
    date: moment([2014, 10, 10])._d,
    name: "First Event"
  }, {date: moment([2014, 10, 10])._d, name: "First Event"}, {date: moment([2014, 10, 10])._d, name: "First Event"}];

  EventCalendar.prototype.getDayEvents = function (date) {

    //finds day events with same date in config.dayEvents array,
    //and returns array of found day events
    return this.dayEvents.map(function (dayEvent) {
      if (dayEvent.date.getTime() === date.getTime()) {
        return dayEvent;
      }
    });
  };

  /**
   *
   * @param events
   * @returns {HTMLElement}
   */
  EventCalendar.prototype.eventsTemplate = function (events) {
    var eventsElement = document.createElement('div');
    eventsElement.classList.add('events');
    Array.prototype.slice.call(events)
      .forEach(function (dayEvent) {
        if (dayEvent) {
          //eventsElement.innerHTML+=dayEvent.name;
          var dayEventElement = document.createElement('div');
          dayEventElement.innerHTML += dayEvent.name;
          eventsElement.appendChild(dayEventElement);
        }
      });
    return eventsElement.innerHTML ? eventsElement : null;
  };

  /**
   *
   * @param events
   * @param dayElement
   */
  EventCalendar.prototype.renderPopup = function (events, dayElement) {
    var dayElementPos = findPos(dayElement),
      popup = this.calendar.getRoot().querySelector('.events-popup'),
      eventsTemplate = this.eventsTemplate(events);
    popup.style.left = (dayElementPos.left + dayElement.offsetWidth).toString() + 'px';
    popup.style.top = (dayElementPos.top + dayElement.offsetHeight).toString() + 'px';
    while (popup.firstChild) {
      popup.removeChild(popup.firstChild);
    }
    if (eventsTemplate instanceof HTMLElement) {
      popup.appendChild(eventsTemplate);
    } else if (typeof eventsTemplate === "string") {
      popup.innerHTML = eventsTemplate;
    } else {
      popup.innerHTML = "No events";
    }
  };

  EventCalendar.prototype.showEvents = function (date) {
    var selectedDay,
      events = this.getDayEvents(date);
    Array.prototype.slice.call(this.calendar.getRoot().querySelector('.calendar-body').childNodes)
      .some(function (day) {
        if (date === day.date) {
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
