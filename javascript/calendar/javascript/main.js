var firstContainer = document.getElementById('firstCalendar');
var secondContainer = document.getElementById('secondCalendar');
var firstCalendar = new Calendar(firstContainer,{year: 2014, month: 5, firstDayOfWeek: "monday", locale: "ua"});
var secondCalendar = new Calendar(secondContainer);
firstCalendar.rootElement.classList.add('table');
firstCalendar.rootElement.classList.add('table-striped');
secondCalendar.rootElement.classList.add('table');
secondCalendar.rootElement.classList.add('table-striped');
document.querySelector('.what-year').onclick= function(){
    secondCalendar.showToday();
    firstCalendar.showToday();
};
document.querySelector('div button').onclick = function () {
    firstCalendar.config.year = document.querySelector('input').value;
};