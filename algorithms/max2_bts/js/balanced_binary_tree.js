(function(document,window){
  window.BalancedBinaryTree = function(){
    BinaryTree.call(this);
    this.balance = function(){
      var array = this.toArray();
      var result=[];

      (function findRoot(dataArray){
       if(dataArray.length > 2){
         result.push(dataArray[(dataArray.length/2) >> 0]);
         findRoot(dataArray.slice(0,(dataArray.length/2)));
         findRoot(dataArray.slice((dataArray.length/2)+1));
       }
        else{
         dataArray.forEach(function(el){
           result.push(el)
         });}
      })(array);

      console.log(result);
      var balancedTree = new BalancedBinaryTree();
    };
  }
})(document,window);
