var firstContainer = document.getElementById('firstCalendar');
var secondContainer = document.getElementById('secondCalendar');

var firstCalendar = new Calendar(firstContainer);
var secondCalendar = new Calendar(secondContainer,{year: 2014, month: 5, firstDayOfWeek: "monday", locale: "ua"});
firstCalendar.rootElement.classList.add('table');
firstCalendar.rootElement.classList.add('table-striped');
secondCalendar.rootElement.classList.add('table');
secondCalendar.rootElement.classList.add('table-striped');

document.querySelector('.btn').onclick = function () {
    var newConfig = {};
    newConfig.year=document.querySelector('.year').value;
    newConfig.month=document.querySelector('.month').value;
    newConfig.firstDayOfWeek=document.querySelector('.firstDayOfWeek').value;
    newConfig.locale=document.querySelector('.locale').value;
    secondCalendar.config = newConfig;
};

firstCalendar.on('calendarClick',function(){
    console.log('It`s Alive!!');
});