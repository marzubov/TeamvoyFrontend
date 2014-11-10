(function(document,window){
  window.Dog = function(){
    Animal.call(this,20);
    this.on('sound',doWoof);

    function doWoof(){
      console.error('Woof!');
    }
  };
})(document,window);
