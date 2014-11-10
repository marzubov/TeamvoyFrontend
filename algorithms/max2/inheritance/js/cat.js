(function(document,window){
  window.Cat = function(name){
    var propName,
      eventMachine = new EventMachine();
    for(propName in eventMachine){
      if(eventMachine.hasOwnProperty(propName))
        this[propName] = EventMachine[propName];
    }

    var animal = new Animal(21,name);
    for(propName in animal){
      if(animal.hasOwnProperty(propName))
      this[propName] = animal[propName];
    }

    this.on('sound',doPurr);

    function doPurr(){
      console.log('Purr');
    }
  };
})(document,window);
