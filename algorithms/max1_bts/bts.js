(function (global, document) {
  var BST = global.BST = function () {
    var s,
      that = this;
    var Node = function (key, leftChild, rightChild, parent, value, x, y) {
      this.key = key;
      this.leftChild = leftChild;
      this.rightChild = rightChild;
      this.value = value;
      this.parent = parent;
      this.x = x || 0;
      this.y = y || 0;
      return this;
    };

    this.search = function (node, key) {
      return (!node) || (key == node.key) ? node : key < node.key
        ? this.search(node.leftChild, key) : this.search(node.rightChild, key);
    };

    this.insert = function (node, key, parent, deep) {
      if (!node.key) {
        node.key = key;
        node.leftChild = new Node();
        node.rightChild = new Node();
        node.parent = parent;
        if (key<parent.key) {
          node.x = parent.x.valueOf() - 1 - deep;

          node.y = parent.y.valueOf() + 1;
        }
        else if(key > parent.key) {
          node.x = parent.x.valueOf() + 1 + deep;

          node.y = parent.y.valueOf() + 1;
        }
        return {node: node, parent: parent };
      }
      else if (key < node.key) return that.insert(node.leftChild, key, node, deep/2);
      else if (key > node.key) return that.insert(node.rightChild, key, node, deep/2);
      else console.log('same node');
    };

    this.findMin = function (node) {
      node = node || that.root;
      if ((node.leftChild) && (node.leftChild.key)) return that.findMin(node.leftChild);
      else return node;
    };

    this.findMax = function (node) {
      node = node || that.root;
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
      node = node || that.root;
      if (node.key) {
        that.traverse(node.leftChild, callback);
        callback(node.key);
        that.traverse(node.rightChild, callback);
      }
      return true;
    };

    this.successor = function (node) {
      node = node || that.root;
      if (node.rightChild.key) return that.findMin(node.rightChild);

      var parent = node.parent;
      while (parent.key && node == parent.rightChild) {
        node = parent;
        parent = parent.parent;
      }
      return parent.key;
    };

    this.predecessor = function (node) {
      node = node || that.root;
      if (node.leftChild.key) return that.findMax(node.leftChild);

      var parent = node.parent;
      while (parent.key && node == parent.leftChild) {
        node = parent;
        parent = parent.parent;
      }
      return parent.key;
    };

    this.sort = function (node) {
      node = node || that.root;
      var result = [];
      that.traverse(node, function (element) {
        result.push(element);
      });
      return result;
    };

    this.generateFromArray = function (data) {
      this.root = new Node();
      for (var i = 0; i < data.length; i++) {
        that.insert(that.root, data[i]);
      }
      return that;
    };

    this.generateRandom = function (count) {
      s = new sigma('container');
      this.root = new Node();
      for (var i = 0; i < count; i++) {
        var deep = count.valueOf();
        var newNode = that.insert(that.root, Math.floor(Math.random() * count*10), that.root, deep/2);
        if (!newNode) continue;
        s.graph.addNode({
          id:newNode.node.key.toString(),
          label:newNode.node.key.toString(),
          x:newNode.node.x,
          y:newNode.node.y,
          size: 1,
          color: '#f00'
        });
        if (newNode.node != newNode.parent){
          s.graph.addEdge({
            id: newNode.node.key.toString()+" to "+newNode.parent.key.toString(),
            // Reference extremities:
            source: newNode.parent.key.toString(),
            target: newNode.node.key.toString()
          });
        }
      }
      s.refresh();
      return that;
    };

    this.displayTree = function () {
      // Let's first initialize sigma:
      var s = new sigma('container');

      // Then, let's add some data to display:
      s.graph.addNode({
        // Main attributes:
        id: 'n0',
        label: 'Hello',
        // Display attributes:
        x: 0,
        y: 0,
        size: 1,
        color: '#f00'
      }).addNode({
        // Main attributes:
        id: 'n1',
        label: 'World !',
        // Display attributes:
        x: 1,
        y: 1,
        size: 1,
        color: '#00f'
      }).addEdge({
        id: 'e0',
        // Reference extremities:
        source: 'n0',
        target: 'n1'
      });

      // Finally, let's ask our sigma instance to refresh:
      s.refresh();
    };

    return this;
  }
})(window, document);
