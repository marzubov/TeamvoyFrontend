(function (global, document){
    var firstContainer = document.getElementById('firstContainer');
    var secondContainer = document.getElementById('secondContainer');
    //var thirdContainer = document.getElementById('thirdContainer');
    //var fourthContainer = document.getElementById('fourthContainer');
    var fifthContainer = document.getElementById('fifthContainer');
    var sixthContainer = document.getElementById('sixthContainer');
    var seventhContainer = document.getElementById('seventhContainer');
    var eightsContainer = document.getElementById('eightsContainer');

    var firstCalendar  = new Calendar(firstContainer,{});
    var secondCalendar = new Calendar(secondContainer,{year: 2014, month: 5});
    //var thirdCalendar = new Calendar(thirdContainer,{daysInWeek: 14});
   // var fourthCalendar = new Calendar(fourthContainer,{daysInWeek: 13});
    var fifthCalendar = new Calendar(fifthContainer,{});
    var sixthCalendar = new Calendar(sixthContainer,{});
    var seventhCalendar = new DateRangePicker(seventhContainer);
    var eightsCalendar = new Calendar(eightsContainer,{});
    seventhCalendar.firstCalendar.getRoot().classList.add('date-range-picker');
    seventhCalendar.secondCalendar.getRoot().classList.add('date-range-picker');
    document.querySelector('.btn').onclick = function () {
        var newConfig = {};
        newConfig.year=document.querySelector('.year').value;
        newConfig.month=document.querySelector('.month').value;
        //newConfig.locale=document.querySelector('.locale').value;
        //newConfig.weekends = ['SAT','SUN'];
        secondCalendar.config = newConfig;
    };
})(window, document);
