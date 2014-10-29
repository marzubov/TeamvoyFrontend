var firstContainer = document.getElementById('firstCalendar');
var secondContainer = document.getElementById('secondCalendar');

var firstCalendar = new Calendar(firstContainer,{});
var secondCalendar = new Calendar(secondContainer,{year: 2014, month: 5, firstDayOfWeek: "monday", locale: "ua"});
firstCalendar.getRoot().classList.add('table');
firstCalendar.getRoot().classList.add('table-striped');
secondCalendar.getRoot().classList.add('table');
secondCalendar.getRoot().classList.add('table-striped');

document.querySelector('.btn').onclick = function () {
    var newConfig = {};
    newConfig.year=document.querySelector('.year').value;
    newConfig.month=document.querySelector('.month').value;
    newConfig.firstDayOfWeek=document.querySelector('.firstDayOfWeek').value;
    newConfig.locale=document.querySelector('.locale').value;
    secondCalendar.config = newConfig;
};
var eventTestFunction = function(){
    document.getElementById('eventCount').innerHTML++;
};
firstCalendar.on('onMonthChanged',eventTestFunction);