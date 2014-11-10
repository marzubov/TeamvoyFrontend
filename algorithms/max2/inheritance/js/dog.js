(function(document,window){
  window.Dog = function(name){
    EventMachine.call(this);
    Animal.call(this,20,name);
    this.on('sound',doWoof);

    function doWoof(){
      console.error('Woof!');
    }
  };
})(document,window);
