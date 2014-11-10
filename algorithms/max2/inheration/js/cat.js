(function(document,window){
  window.Cat = function(){
    Animal.call(this,21);
    this.on('sound',doPurr);

    function doPurr(){
      console.log('Purr');
    }
  };
})(document,window);
