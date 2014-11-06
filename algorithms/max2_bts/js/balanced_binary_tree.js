(function(document,window){
  window.BalancedBinaryTree = function(){
    BinaryTree.call(this);
    this.reBalance = function(){
      var array = this.toArray();
      var result=[];
      (function recursive(dataArray){
       if(dataArray.length > 2){
         result.push(dataArray[(dataArray.length/2)]);
         recursive(dataArray.slice(0,(dataArray.length/2)));
         recursive(dataArray.slice(dataArray.length/2));
       }
        else{
         dataArray.forEach(function(el){
           result.push(el)
         });}
      })(array);
      console.log(result);

    };
  }
})(document,window);
