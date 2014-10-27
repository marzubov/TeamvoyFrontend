var EventMachine = function () {
    var array_of_function = {'change':[], 'click':[]}

    this.on = function(event, func){
        array_of_function[event].push(func);
        console.log(array_of_function[event]);

    };

    this.off = function(event, func){
        var count = array_of_function[event].length;
        var strfunc = func.toString();
        for (var i = 0; i < count; i += 1) {
            var eventFunc = array_of_function[event][i].toString();
            eventFunc.replace( /\s/g, "");
            if (eventFunc == strfunc.replace( /\s/g, ""))
            {
                array_of_function[event].splice(i,1);
            }
        }
        console.log(array_of_function[event]);
    };

    this.trigger = function (event) {
        var count = array_of_function[event].length;
        for (var i = 0; i < count; i += 1) { array_of_function[event][i]();}
    }
};