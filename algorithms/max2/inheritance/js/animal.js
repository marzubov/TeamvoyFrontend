(function(document,window){
  window.Animal = function(runningSpeed,name){
    //FOR SNAKE ONLY
    Animal.superclass.constructor.call(this);

    var speed = runningSpeed,
     positionX =0;
    this.name = name;
    this.makeSound = function(){
      this.trigger('sound');
    };
    this.run = function(){
      positionX += speed;
      this.trigger('running');
      console.log('run', this.name);
    }
  };
  Animal.extend(EventMachine);
})(document,window);
