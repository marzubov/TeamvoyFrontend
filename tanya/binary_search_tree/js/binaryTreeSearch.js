(function(global, document) {
    global.BinaryTree = function BinaryTree(array){
        this.root = null;
        var _this = this;
        array.forEach(function(el,i){
          _this.add(el);
        });
    };

    BinaryTree.prototype.add = function(value){
        "use strict";
        var currentNode, node = {
            value : value,
            left  : null,
            right : null
            };
        if (this.root === null) {
            this.root = node;
        } else {
            currentNode = this.root;
            while (true) {
                if (value < currentNode.value) {
                    if (currentNode.left === null) {
                        currentNode.left = node;
                        break;
                    } else {
                        currentNode = currentNode.left;
                    }
                } else if (value > currentNode.value) {
                    if (currentNode.right === null) {
                        currentNode.right = node;
                        break;
                    } else {
                        currentNode = currentNode.right;
                    }
                } else {
                    break;
                }
            }
        }
        return this.root;
    };

    BinaryTree.prototype.contains = function(value, node){
        "use strict";
        if (node === null) return false;
        if (node.value == value) return node;
        else if (value < node.value) return this.contains(value, node.left);
        else return this.contains(value, node.right);
    };

    BinaryTree.prototype.findMin = function () {
      var current_node = this.root;
      while (current_node.left) current_node = current_node.left;
      return current_node.value;
    };

    BinaryTree.prototype.findMax = function () {
      var current_node = this.root;
      while (current_node.right) current_node = current_node.right;
      return current_node.value;
    };

    BinaryTree.prototype.sort = function(root) {
        if (root.left != null) { this.sort(root.left);}
        console.log(root.value);
        if (root.right != null) { this.sort(root.right);}
    };

    BinaryTree.prototype.parent = function (value) {
      var parent = null, isFound = false,
        currentNode = this.root;
      while(!isFound && currentNode){
        if (value < currentNode.value){
          parent = currentNode;
          currentNode = currentNode.left;
        } else if (value > currentNode.value){
          parent = currentNode;
          currentNode = currentNode.right;
        } else {
          isFound = true;
        }
      }
      return parent;
    };

    BinaryTree.prototype.remove = function(value) {
      var parent = null, foundedNode = null, success;
      if (this.root === null) { console.log("Tree is empty"); return false; }
      foundedNode = this.contains(value, this.root);
      parent = this.parent(foundedNode.value);
      if (!foundedNode) { console.log("Tree hasn't this value"); return false; }
      if (foundedNode.left && foundedNode.right) {
        parent = foundedNode;
        success = foundedNode.right;
        while (success.left) {
          parent = success;
          success = success.left;
        }
        foundedNode.value = success.value;
        foundedNode = success;
      }
      if (!foundedNode.left && !foundedNode.right) {
        if (parent.right == foundedNode) { parent.right = null;
        } else { parent.left = null; }
        return true;
      }
      if (!foundedNode.left && foundedNode.right) {
        if (parent.left == foundedNode) { parent.left = foundedNode.right;
        } else { parent.right = foundedNode.right; }
        return true;
      }
      if (foundedNode.left && !foundedNode.right) {
        if (parent.left == foundedNode) { parent.left = foundedNode.left;
        } else { parent.right = foundedNode.left; }
        return true;
      }
    }
})(window, document);
