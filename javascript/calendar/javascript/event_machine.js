(function(window,document){
    var EventMachine = window.EventMachine  = function(){

        this.on = function(eventName,callback){
            document.addEventListener(eventName,callback);
        };

        this.off = function(eventName,callback){
            document.removeEventListener(eventName,callback);
        };

        this.trigger= function(eventName){
            var event = new CustomEvent(eventName);
            document.dispatchEvent(event);
        };
    };

})(window,document);