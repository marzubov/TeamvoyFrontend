(function(window,document){
    var EventMachine = window.EventMachine = function(){
        this.funcArray=[];

        this.on = function(eventName,callback){
            this.funcArray.push({event: eventName, callback: callback});
            return this;
        };

        this.off = function(eventName,callback){
            this.funcArray=this.funcArray.filter(function(el){
                return el.event != eventName && el.callback != callback;
            });
            return this;
        };

        this.trigger = function(eventName){
            this.funcArray.forEach(function(el){
                if(el.event == eventName){
                    el.callback();
                }
            });
            return this;
        }
    }
})(window,document);