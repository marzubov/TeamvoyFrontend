(function(window,document){
    var EventMachine = window.EventMachine  = function(){

        EventMachine.prototype.on = function(eventName,callback){
            document.addEventListener(eventName,callback);
        };

        EventMachine.prototype.off = function(eventName,callback){
            document.removeEventListener(eventName,callback)
        };

        EventMachine.prototype.trigger= function(eventName){
            var event = new CustomEvent(eventName);
            document.dispatchEvent(event);
        };
    };

})(window,document);