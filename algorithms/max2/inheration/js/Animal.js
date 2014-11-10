(function(document,window){
  window.Animal = function(runningSpeed,name){
    var speed = runningSpeed,
     positionX =0;
    EventMachine.call(this);
    this.makeSound = function(){
      this.trigger('sound');
    };
    this.run = function(){
      positionX += speed;
      this.trigger('running');
      console.log('run', positionX);
    }
  }
})(document,window);
