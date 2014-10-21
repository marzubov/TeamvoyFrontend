/*jslint latedef:false*/
var container = document.getElementById('placeForCalendar');
var firstCalendar=new Calendar(container,{year: 2014, month: 5, firstDayOfWeek: "sunday", locale: "en"}).element;
new Calendar(container,{year: 2015, month: 1, firstDayOfWeek: "thursday", locale: "ua"});

firstCalendar.cellSpacing=10;
