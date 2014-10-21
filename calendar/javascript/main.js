var container = document.getElementById('placeForCalendar');

var firstCalendar = new Calendar(container, {year: 2014, month: 5, firstDayOfWeek: "sunday", locale: "en"});
var secondCalendar = new Calendar(container, { year: 2015, month: 1, firstDayOfWeek: "thursday", locale: "ua"});

