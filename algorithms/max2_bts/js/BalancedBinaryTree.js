﻿(function (document, window) {
  window.BalancedBinaryTree = function (data, left, right) {
    this.value = data;
    this.left = left;
    this.right = right;

    this.search = function (k) {
      return k == this.value ?
        this : k > this.value ?
        this.right ? this.right.search(k) : null :
        this.left ? this.left.search(k) : null;
    };

    this.add = function(value){
      var tree = new BalancedBinaryTree(value);
      this.value ?
        this.value > tree.value ?
          this.left ?
            this.add.call(this.left,value) : this.left = tree :
          this.right ?
            this.add.call(this.right,value) : this.right = tree :
        this.value = tree;
    }
  }
})(document, window);
