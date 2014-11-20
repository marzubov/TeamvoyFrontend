/**
 * Created by MU on 10/27/14.
 */

var EventMachine = function () {
    var array_of_function = {}

    this.on = function(events, func){
        var arrayOfEvents = events.split(" ");
        arrayOfEvents.forEach(function(el){
            el = el.toLowerCase();
            if (!array_of_function[el]) array_of_function[el] = [];
            array_of_function[el].push(func);
            console.log(array_of_function);
        });
    };

    this.off = function(events, func){
        var arrayOfEvents = events.split(" ");
        arrayOfEvents.forEach(function(el){
            //el = el.toLowerCase();
            var count = array_of_function[el].length;
            var strfunc = func.toString();
            for (var i = 0; i < count; i += 1) {
                var eventFunc = array_of_function[el][i].toString();
                if (eventFunc === strfunc)
                {
                    array_of_function[el].splice(i,1); break;
                }
            }
            console.log(array_of_function);
        });
    };

    this.trigger = function (events) {
        var arrayOfEvents = events.split(" ");
        arrayOfEvents.forEach(function(el) {
            var count = array_of_function[el].length;
            for (var i = 0; i < count; i += 1) {
                array_of_function[el][i]();
            }
        });
    }
};