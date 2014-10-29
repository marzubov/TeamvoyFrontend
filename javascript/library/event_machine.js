(function(window,document){
    var EventMachine = window.EventMachine = function(){
        var funcArray={};

        /**
         * Set new event handler
         * @param events {String} - event names separated by space;
         * @param eventHandler {Function} - function that will be called when event triggers;
         * @returns {window.EventMachine}
         */
        this.on = function(events,eventHandler){
            events.split(/\s+/)
                  .forEach(function(event) {
                    !funcArray[event] ? funcArray[event]=[]:0;
                    funcArray[event].push(eventHandler);
            });
            return this;
        };

        /**
         * Remove event handler
         * @param events {String} - event names separated by space;
         * @param eventHandler {Function} - function that will be called when event triggers;
         * @returns {window.EventMachine}
         */
        this.off = function(events,eventHandler){
            events.split(/\s+/)
                  .forEach(function(event){
                    if(funcArray[event])
                funcArray[event]=funcArray[event].filter(function(handler){
                    return !(handler === eventHandler);
                });
            });
            return this;
        };

        /**
         * Call listeners of event
         * @param events {String} - event names separated by space;
         * @returns {window.EventMachine}
         */
        this.trigger = function(events){
            events.split(/\s+/)
                  .forEach(function(event) {
                    if (funcArray[event]) {
                        funcArray[event].forEach(function (handler) {
                            handler()
                        });
                    }
            });
            return this;
        }
    }
})(window,document);