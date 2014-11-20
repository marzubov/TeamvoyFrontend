(function (document, window) {
  'use strict';

  /**
   * Creates binary search tree.
   * @param parent {window.BinaryTree} - the parent tree
   * @constructor
   */
  window.BinaryTree = function (parent) {
    BinaryTree.superclass.constructor.call(this);
    this.parent = parent;
    this.height = 0;
    /**
     * Add array to the tree
     * @param dataArray
     */
    this.addArray = function (dataArray) {
      console.log('add', dataArray);
      var that = this;
      dataArray.forEach(function (el) {
        that.add(el);
      });
      console.log('tree', this);
    };

    /**
     * Finds element of the tree with value
     * @param value - value that needs to be find
     * @returns {window.BinaryTree} - subtree with value
     */
    this.search = function (value) {
      return value === this.value ?
        this : value > this.value ?
        this.right ? this.right.search(value) : null :
        this.left ? this.left.search(value) : null;
    };

    /**
     * Add one subtree with value to the tree
     * @param value - value that is need to be added
     * @returns {window.BinaryTree} - returns added element
     */
    this.add = function (value) {
      if (this.value) {
        if (this.value > value) {
          if (!this.left) {
            this.left = new BinaryTree(this);
            this.height += 1;
          }
          this.add.call(this.left, value);
        } else {
          if (!this.right) {
            this.right = new BinaryTree(this);
            this.height += 1;
          }
          this.add.call(this.right, value);
        }
      } else {
        this.value = value;
        var root = this;
        while (root.parent) {
          root = root.parent;
        }
        root.trigger('add', [this]);
      }
      return this;
    };

    /**
     * Sort values in tree and put it to the array
     * @returns {Array} - array with data
     */
    this.toArray = function () {
      var result = [];
      inorder(this);
      function inorder(tree) {
        tree.left && inorder(tree.left);
        result.push(tree.value);
        tree.right && inorder(tree.right);
      }

      return result;
    };

    /**
     * Finds min value in the tree
     * @returns {*} - element with value
     */
    this.min = function () {
      return this.left ? this.min.call(this.left) : this;
    };

    /**
     * Finds max value in the tree
     * @returns {*} - returns element with value
     */
    this.max = function () {
      return this.right ? this.max.call(this.right) : this;
    };

    /**
     * Removes element with value
     * @param value - value needs to be removed
     */
    this.remove = function (value) {
      var tree = this.search(value);
      if (!(tree.left && tree.right)) {
        tree.parent.left.value == value ? tree.parent.left = undefined : tree.parent.right = undefined;
      } else if (tree.left && !tree.right) {
        tree.parent.left = tree.left;
      } else if (!tree.left && tree.right) {
        tree.parent.right = tree.right;
      } else {
        var successor = tree.successor();
        tree.right = successor.right;
        tree.value = successor.value;
      }
    };

    /**
     * Finds element that must be inserted if current tree would be removed ( min element from right tree )
     * @returns {*} - element with such value
     */
    this.successor = function () {
      if (this.right)
        return this.right.min();
      else {
        var parent = this.parent, that = this;
        while (!parent && that == parent.right) {
          that = parent;
          parent = that.parent;
        }
        return !parent ? -1 : parent;
      }
    }
  };

  BinaryTree.extend(EventMachine);
})(document, window);
