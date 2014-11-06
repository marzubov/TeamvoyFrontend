(function (document, window) {
  window.BinaryTree = function (data, left, right) {
    this.value = data;
    this.left = left;
    this.right = right;

    this.search = function (value) {
      return value == this.value ?
        this : value > this.value ?
        this.right ? this.right.search(value) : null :
        this.left ? this.left.search(value) : null;
    };

    this.add = function(value){
      var tree = new BinaryTree(value);
      this.value ?
        this.value > tree.value ?
          this.left ?
            this.add.call(this.left,value) : this.left = tree :
          this.right ?
            this.add.call(this.right,value) : this.right = tree :
        this.value = tree;
    };
    this.toArray = function(){
      var result=[];
      inorder(this);
      function inorder(tree) {
        tree.left && inorder(tree.left);
        result.push(tree.value);
        tree.right && inorder(tree.right);
      }
      return result;
    }
  };
})(document, window);
