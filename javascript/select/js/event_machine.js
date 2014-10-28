(function(window,document){
    var EventMachine = window.EventMachine = function(){
        this.funcArray=[];
        this.on = function(eventName,callback){
            this.funcArray.push({event: eventName, callback: callback});
        }
    }
})(window,document);