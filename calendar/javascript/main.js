/*jslint latedef:false*/
var container = document.getElementById('placeForCalendar');
new Calendar(container,{year: 2014, month: 5, firstDayOfWeek: "sunday", locale: "en"})
    .element.cellSpacing=10;
new Calendar(container,{year: 2015, month: 1, firstDayOfWeek: "thursday", locale: "ua"})
    .element.cellSpacing=10;

