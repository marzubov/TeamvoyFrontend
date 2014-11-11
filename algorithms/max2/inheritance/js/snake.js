(function(document,window){

  window.Snake = function(name){
    Snake.superclass.constructor.call(this,2,name);
    this.on('sound',function(){
      console.log('What does the snake says?');
    })
  };
  Snake.extend(Animal);


})(document,window);
