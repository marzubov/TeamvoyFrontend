(function (global, document){
    var firstContainer = document.getElementById('firstCalendar');
    var secondContainer = document.getElementById('secondCalendar');
    var thirdContainer = document.getElementById('thirdCalendar');
    var fourthContainer = document.getElementById('fourthCalendar');
    var fifthContainer = document.getElementById('fifthCalendar');

    var firstCalendar  = global.firstCalendar = new Calendar(firstContainer,{});
    var secondCalendar = new Calendar(secondContainer,{year: 2014, month: 5, style:"customize", firstDayOfWeek: "Пн", locale: "ua", weekends:["Сб","Нд"]});
    var thirdCalendar = new Calendar(thirdContainer,{daysInWeek: 14});
    var fourthCalendar = new Calendar(fourthContainer,{daysInWeek: 13});
    var fifthCalendar = new Calendar(fifthContainer,{style:"customize"});
    firstCalendar.getRoot().classList.add('table', 'table-striped');
    secondCalendar.getRoot().classList.add('table', 'table-striped');
    thirdCalendar.getRoot().classList.add('table', 'table-striped');
    fourthCalendar.getRoot().classList.add('table', 'table-striped');
    fifthCalendar.getRoot().classList.add('table', 'table-striped');

    document.querySelector('.btn').onclick = function () {
        var newConfig = {};
        newConfig.year=document.querySelector('.year').value;
        newConfig.month=document.querySelector('.month').value;
        newConfig.locale=document.querySelector('.locale').value;
        newConfig.weekends = ['SAT','SUN'];
        secondCalendar.config = newConfig;
    };

    var eventTestFunction = function(e){
        console.log('monthChanged');
    };
    firstCalendar.on('onMonthChanged',eventTestFunction);
})(window, document);