(function (document, window) {
  window.BinaryTree = function (data,parent,left,right) {
    this.value = data;
    this.parent = parent;
    this.left = left;
    this.right = right;

    this.addArray = function(dataArray){
      console.log('add',dataArray);
      var that=this;
      dataArray.forEach(function(el){
        that.add(el)
      });
      console.log('tree',this)
    };

    this.search = function (value) {
      return value == this.value ?
        this : value > this.value ?
        this.right ? this.right.search(value) : null :
        this.left ? this.left.search(value) : null;
    };

    this.add = function(value){
       this.value ?
        this.value > value ?
          this.left ?
            this.add.call(this.left,value) : this.left = new BinaryTree(value,this) :
          this.right ?
            this.add.call(this.right,value) : this.right = new BinaryTree(value,this) :
        this.value = value;
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
    };

    this.min = function(){
      return this.left ? this.min.call(this.left) : this;
    };

    this.max = function(){
      return this.right ? this.max.call(this.right) : this;
    };

    this.remove = function(value){
      var tree = this.search(value);
      if(!(tree.left && tree.right))
        tree.parent.left.value == value ? tree.parent.left =undefined : tree.parent.right =undefined
        else if(tree.left && !tree.right){
        tree.parent.left= tree.left;
        }
        else if (!tree.left && tree.right) {
        tree.parent.right = tree.right;
      }
        else{
        var successor = tree.successor();
        tree.right = successor.right;
        tree.value = successor.value;
        }
      };
    this.successor = function(){
      if(this.right)
      return this.right.min();
      else{
        var parent = this.parent, that=this;
        while(!parent && that == parent.right){
          that = parent;
          parent = that.parent;
        }
        return !parent? -1 : parent;
      }
    }
  };
})(document, window);
