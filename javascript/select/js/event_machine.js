(function(window,document){
    var EventMachine = window.EventMachine = function(){
        this.funcArray=[];

        this.on = function(eventArray,callback){
            var that=this;
            eventArray=eventArray.split(' ');
            eventArray.forEach(function(event) {
                that.funcArray.push({event: event, callback: callback});
            });
            return this;
        };

        this.off = function(eventArray,callback){
            var that=this;
            eventArray=eventArray.split(' ');
            eventArray.forEach(function(event){
                that.funcArray=that.funcArray.filter(function(el){
                    return el.event != event && el.callback != callback;
                });
            });

            return this;
        };

        this.trigger = function(eventArray){
            var that=this;
            eventArray=eventArray.split(' ');
            eventArray.forEach(function(event) {
                that.funcArray.forEach(function (el) {
                    if (el.event == event) {
                        el.callback();
                    }
                });
            });
            return this;
        }
    }
})(window,document);