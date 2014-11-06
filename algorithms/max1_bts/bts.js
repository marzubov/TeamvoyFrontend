(function (global, document) {
  var BST = global.BST = function (count, data) {
    var that = this;
    var Node = function (key, leftChild, rightChild, parent, value) {
      this.key = key;
      this.leftChild = leftChild;
      this.rightChild = rightChild;
      this.value = value;
      this.parent = parent;
      return this;
    };

    this.search = function (node, key) {
      return (!node) || (key == node.key) ? node : key < node.key
        ? this.search(node.leftChild, key) : this.search(node.rightChild, key);
    };

    this.insert = function (node, key, parent) {
      console.log(node);
      if (!node.key) {
        node.key = key;
        node.leftChild = new Node();
        node.rightChild = new Node();
        node.parent = parent;
        return true;
      }
      else if (key < node.key) that.insert(node.leftChild, key, node);
      else if (key > node.key) that.insert(node.rightChild, key, node);
    };

    this.findMin = function (node) {
      if ((node.leftChild) && (node.leftChild.key)) return that.findMin(node.leftChild);
      else return node;
    };

    this.findMax = function (node) {
      if ((node.rightChild) && (node.rightChild.key)) return that.findMax(node.rightChild);
      else return node;
    };

    this.replaceNodeInParent = function (node, newNode) {
      if (node.parent) {
        if (node.parent.leftChild == node) node.parent.leftChild = newNode;
        else node.parent.rightChild = newNode;
      }
      if (newNode) newNode.parent = node.parent;
    };

    this.remove = function (node, key) {
      if (key < node.key)that.remove(node.leftChild, key);
      else if (key > node.key)that.remove(node.rightChild, key);
      else if ((node.leftChild.key) && (node.rightChild.key)) {
        var successor = that.findMin(node.rightChild);
        node.key = successor.key;
        that.remove(successor, successor.key);
      } else if (node.leftChild.key) that.replaceNodeInParent(node, node.leftChild);
      else if (node.rightChild.key) that.replaceNodeInParent(node, node.rightChild);
      else that.replaceNodeInParent(node);
    };

    this.traverse = function (node, callback) {
      if (node.key) {
        that.traverse(node.leftChild, callback);
        callback(node.key);
        that.traverse(node.rightChild, callback);
      }
      return true;
    };

    this.successor = function (node) {
      if (node.rightChild.key) return that.findMin(node.rightChild);

      var parent = node.parent;
      while (parent.key && node == parent.rightChild) {
        node = parent;
        parent = parent.parent;
      }
      return parent.key;
    };

    this.predecessor = function (node) {
      if (node.leftChild.key) return that.findMax(node.leftChild);

      var parent = node.parent;
      while (parent.key && node == parent.leftChild) {
        node = parent;
        parent = parent.parent;
      }
      return parent.key;
    };

    this.sort = function(node){
      var result = [];
      that.traverse(node, function (element) {
        result.push(element);
      });
      return result;
    };
    this.root = new Node();
    for (var i = 0; i < count; i++) {
      that.insert(that.root, Math.floor(Math.random() * 1000));
    }
  }
})(window, document);
