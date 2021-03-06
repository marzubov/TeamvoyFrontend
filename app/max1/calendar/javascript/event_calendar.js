(function (global, document) {
  "use strict";
  /*global moment:true, EventMachine: true, Calendar:true, EventCalendar:true,
   window:true, document:true, HTMLElement: true */
  global.EventCalendar = function EventCalendar(container, config, dayEvents) {

    var that = this;
    this.eventCalendarContainer = document.createElement('div');
    this.popup = document.createElement('div');
    this.dayEvents = [{
      date: moment()._d,
      name: "Default Event"
    }];
    function setEvents() {
      that.on('daySelected', function (day) {
        that.showEvents(day);
      });
      that.on('monthChanged', function () {
        that.renderEventDays();
      });
      document.addEventListener('click', function (e) {
        if ((e.target !== that.getRoot()) && (!e.target.classList.contains('events-popup')) && (!that.getRoot().contains(e.target))) {
          that.popup.classList.remove('active');
          that.popup.classList.add('non-active');
        }
      });
    }

    function init() {
      that.eventCalendarContainer.classList.add('event-calendar');
      that.popup.classList.add('events-popup', 'non-active');
      that.eventCalendarContainer.appendChild(that.popup);
      container.appendChild(that.eventCalendarContainer);
      Calendar.call(that, that.eventCalendarContainer, config);
      if (dayEvents) {
        that.dayEvents = dayEvents;
      }
      that.renderEventDays();
      setEvents();
      that.trigger('load', [that]);
    }

    init();

    return this;

  };

  EventCalendar.prototype = Object.create(Calendar.prototype);
  EventCalendar.prototype.getDayEvents = function (date) {

    //finds day events with same date in config.dayEvents array,
    //and returns array of found day events
    var currentDayEvents = [];
    this.dayEvents.forEach(function (dayEvent) {
      if (dayEvent.date.getTime() === date.getTime()) {
        currentDayEvents.push(dayEvent);
      }
    });
    return currentDayEvents;
  };

  EventCalendar.prototype.renderEventDays = function () {
    var that = this;
    Array.prototype.slice.call(this.getRoot().querySelector('.calendar-body').childNodes)
      .map(function (day) {
        if (that.getDayEvents(day.date)[0]) {
          day.classList.add('calendar-event-day');
        }
      });
  };

  EventCalendar.prototype.createDayEvent = function (newDayEvent) {
    this.dayEvents.push(newDayEvent);
  };

  EventCalendar.prototype.updateDayEvent = function (toUpdateDayEvent, newDayEvent) {
    var that = this;
    return this.dayEvents.some(function (dayEvent, i) {
      if ((dayEvent.name === toUpdateDayEvent.name) && (dayEvent.date.getTime() === toUpdateDayEvent.date.getTime())) {
        that.dayEvents[i] = newDayEvent;
        return true;
      }
    });
  };

  EventCalendar.prototype.deleteDayEvent = function (toDeleteDayEvent) {
    var that = this;
    return this.dayEvents.some(function (dayEvent, i) {
      if ((dayEvent.name === toDeleteDayEvent.name) && (dayEvent.date.getTime() === toDeleteDayEvent.date.getTime())) {
        that.dayEvents.splice(i, 1);
        return true;
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
          dayEventElement.classList.add('event');
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
    var eventsTemplate = this.eventsTemplate(events);
    while (this.popup.firstChild) {
      this.popup.removeChild(this.popup.firstChild);
    }
    if (eventsTemplate instanceof HTMLElement) {
      this.popup.appendChild(eventsTemplate);
    } else if (typeof eventsTemplate === "string") {
      this.popup.innerHTML = eventsTemplate;
    } else {
      this.popup.innerHTML = "No events";
    }
  };

  EventCalendar.prototype.showEvents = function (date) {
    var selectedDay,
      events = this.getDayEvents(date);
    Array.prototype.slice.call(this.getRoot().querySelector('.calendar-body').childNodes)
      .some(function (day) {
        if (date === day.date) {
          selectedDay = day;
          return true;
        }
      });
    if (selectedDay) {
      this.renderPopup(events, selectedDay);
      this.popup.classList.remove('non-active');
      this.popup.classList.add('active');
    }
  };

})(window, document);
