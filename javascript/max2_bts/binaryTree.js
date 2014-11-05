(function(document,window){
  var BalancedBinaryTree = window.BalancedBinaryTree = function(){
    this.root;
    this.search = function(root,key){
      return root || key == this.value ?
         root :
        key < this.value ? this.search(this.left(root),key) :
          this.search(this.right(root),key)
    };
  }
})(document,window);
