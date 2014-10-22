var container = document.getElementById('placeForCalendar');
var firstTable = new Calendar(container,{year: 2014, month: 5, firstDayOfWeek: "sunday", locale: "en"});
var secondTable = new Calendar(container,{year: 2015, month: 1, firstDayOfWeek: "monday", locale: "ua"});

document.querySelector('.year').onclick= function(){
    secondTable.today();
    firstTable.today();
};