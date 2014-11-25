(function (global, document) {
  "use strict";
  /*global moment:true, EventMachine: true, Calendar:true, EventCalendar:true,
   window:true, document:true, HTMLElement: true */
  global.EventCalendar = function EventCalendar(container, config, dayEvents) {

    var that = this;
    this.eventCalendar = document.createElement('div');
    this.eventsWrapper = document.createElement('div');
    this.dayEvents = [{
      date: moment()._d,
      name: "Default Event"
    }];
    function setEvents() {
      that.on('daySelected', function (day) {
        that.showEvents(day);
      });
      that.on('monthChanged', function () {
        that.renderDaysWithEvents();
      });
      that.eventsWrapper.querySelector('.calendar-events')
        .addEventListener('click', function(){
          //TODO: Open info event box
        });
    }

    function init() {

      that.eventCalendar.classList.add('event-calendar');
      Calendar.call(that, that.eventCalendar, config);
      that.eventsWrapper.appendChild(that.renderEventsWrapper());
      that.eventsWrapper.classList.add('calendar-events-wrapper');
      that.eventCalendar.appendChild(that.eventsWrapper);
      container.appendChild(that.eventCalendar);

      if (!dayEvents) {
        that.dayEvents = JSON.parse(localStorage.getItem('dayEvents')) || that.dayEvents;
      } else {
        that.dayEvents = dayEvents;
      }
      that.renderDaysWithEvents();
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
      if (new Date(dayEvent.date).getTime() === date.getTime()) {
        currentDayEvents.push(dayEvent);
      }
    });
    return currentDayEvents;
  };

  EventCalendar.prototype.renderDaysWithEvents = function () {
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
    localStorage.setItem('dayEvents', JSON.stringify(this.dayEvents));
  };

  EventCalendar.prototype.updateDayEvent = function (toUpdateDayEvent, newDayEvent) {
    var that = this;
    this.dayEvents.some(function (dayEvent, i) {
      if (!dayEvent.name) {
        return;
      }
      //TODO: day to update checking
      if ((dayEvent.name === toUpdateDayEvent.name) && (dayEvent.date.getTime() === toUpdateDayEvent.date.getTime())) {
        that.dayEvents[i] = newDayEvent;
        return true;
      }
    });
    localStorage.setItem('dayEvents', JSON.stringify(this.dayEvents));
  };

  EventCalendar.prototype.deleteDayEvent = function (toDeleteDayEvent) {
    var that = this;
    return this.dayEvents.some(function (dayEvent, i) {
      //TODO: day to delete checking
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
  EventCalendar.prototype.renderEvents = function (events) {
    var eventsElement = document.createDocumentFragment();

    //TODO: nice event template
    Array.prototype.slice.call(events)
      .forEach(function (dayEvent) {
        if (dayEvent) {
          //eventsElement.innerHTML+=dayEvent.name;
          var dayEventElement = document.createElement('div');
          dayEventElement.classList.add('calendar-event');
          dayEventElement.innerHTML += dayEvent.name;
          dayEventElement['dayEvent'] = dayEvent;
          eventsElement.appendChild(dayEventElement);
        }
      });
    return eventsElement;
  };

  /**
   *
   * @param dayEvents
   * @param dayElement
   */
  EventCalendar.prototype.renderEventsWrapper = function () {
    var eventsWrapperFragment = document.createDocumentFragment(),
      events = document.createElement('div'),
      addButton = document.createElement('button'),
      closeButton = document.createElement('button');

    events.innerHTML = "No Events";
    addButton.innerHTML = 'Add';
    closeButton.innerHTML = 'Close';

    events.classList.add('calendar-events');
    addButton.classList.add('calendar-events-add-button');
    closeButton.classList.add('calendar-events-close-button');

    eventsWrapperFragment.appendChild(events);
    eventsWrapperFragment.appendChild(addButton);
    eventsWrapperFragment.appendChild(closeButton);
    eventsWrapperFragment.appendChild(this.renderCalendarEventAddPopup());
    eventsWrapperFragment.appendChild(this.renderCalendarEventInfoPopup());
    return eventsWrapperFragment;
  };

  EventCalendar.prototype.renderCalendarEventInfoPopup = function(){
    var eventInfoPopup = document.createElement('div'),
      date = document.createElement('div'),
      name = document.createElement('div'),
      updateButton = document.createElement('button'),
      deleteButton = document.createElement('button'),
      closeButton = document.createElement('button');

    eventInfoPopup.classList.add('calendar-event-info-popup');
    date.classList.add('calendar-event-info-popup-date');
    name.classList.add('calendar-event-info-popup-name');
    updateButton.classList.add('calendar-event-info-popup-update-button');
    deleteButton.classList.add('calendar-events-info-popup-delete-button');
    closeButton.classList.add('calendar-events-info-popup-close-button');

    updateButton.innerHTML = 'Update';
    deleteButton.innerHTML = 'Delete';
    closeButton.innerHTML = 'Close';

    eventInfoPopup.appendChild(date);
    eventInfoPopup.appendChild(name);
    eventInfoPopup.appendChild(updateButton);
    eventInfoPopup.appendChild(deleteButton);

    return eventInfoPopup;
  };

  EventCalendar.prototype.renderCalendarEventAddPopup= function () {
    var eventAddPopup = document.createElement('div'),
      date = document.createElement('div'),
      name = document.createElement('div'),
      addButton = document.createElement('button'),
      closeButton = document.createElement('button');

    eventAddPopup.classList.add('calendar-event-add-popup');
    date.classList.add('calendar-event-add-popup-date');
    name.classList.add('calendar-event-add-popup-name');
    addButton.classList.add('calendar-event-add-popup-add-button');
    closeButton.classList.add('calendar-events-add-popup-close-button');

    addButton.innerHTML = 'Add';
    closeButton.innerHTML = 'Close';

    eventAddPopup.appendChild(date);
    eventAddPopup.appendChild(name);
    eventAddPopup.appendChild(addButton);

    return eventAddPopup;
  };

  EventCalendar.prototype.showEvents = function (date) {
    var that = this,
      events = that.getDayEvents(date);

    that.eventsWrapper.querySelector('.calendar-events').deleteAllChildNodes();

    Array.prototype.slice.call(this.getRoot().querySelector('.calendar-body').childNodes)
      .some(function (day) {
        if (date === day.date) {
          that.eventsWrapper.querySelector('.calendar-events')
            .appendChild(that.renderEvents(events));
          that.eventsWrapper.querySelector('.calendar-events').date = date;
          return true;
        }
      });
  };

})(window, document);
