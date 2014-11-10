(function(document,window){
  window.Animal = function(runningSpeed,name){
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
  }
})(document,window);
