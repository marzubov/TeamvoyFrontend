/**
 * Created by MU on 10/27/14.
 */
function EventMachine(){
    var that;
}

EventMachine.prototype.on = function(cmdName, cmdFunction){
    console.log('on');
    console.log(cmdName, cmdFunction);
    //this.eventMachineFunctions.push({cmdName: cmdFunction});
    if (cmdName == 'change') {
        this.eventMachineFunctions.change.push(cmdFunction);
    }
};

EventMachine.prototype.off = function(cmdName, cmdFunction){
    console.log('off');
};

EventMachine.prototype.trigger = function(cmdName){
    console.log('trigger');
};

EventMachine.prototype.eventMachineFunctions = {
    change: []
};