/**
 * AVL Tree
 * Created by Tetiana Stoyko
 *
 * It's the class, that have the next public methods:
 * add, remove, contains, findMin, findMax, sort, parent
 *
 * The balance algorithm - private methods and this methods calls when we add the elements.
 * Balance algorithm works in such cases:
 * rotateLeft method:
 *      6           4               6           3
 *     /           / \             /           / \
 *    3     =>    3   6      ,    3     =>    1   6
 *     \                         /
 *      4                       1
 * rotateRight method:
 *      6           7           6                8
 *       \         / \           \              / \
 *        8  =>   6   8    ,      8      =>    6   9
 *       /                         \
 *      7                           9
 */

(function(global, document) {

  /**
   * Class BinaryTree - present all operations with this tree.
   * @param {array} array - The elements, that we want to add to the tree.
   * @constructor
   * @return {object} - the tree and all operations with this tree.
   */
    global.BinaryTree = function BinaryTree(array){

      /** ----------------------------------------
       *  The private methods for balance algorithm.
       *  ----------------------------------------
       */

      /**
       * Method for finding the height of node.
       * @param node {object} - for this node we find height
       * @returns {number} - the height of given node.
       */
      function height(node) {
        return node ? node.height : 0;
      }

      /**
       * Method for finding the balance factor of node.
       * @param node {object} - for this node we find the difference between it height of right child
       * and height of left child
       * @returns {number} - factor of balance for given node.
       */
      function balanceFactor(node) {
        return changeHeight(node.right) - changeHeight(node.left);
      }

      /**
       * Method for changing height after adding or removing the elements
       * @param node {object} - for this node we change height.
       * @returns {number} - new height of node.
       */
      function changeHeight(node) {
        if (node == null) return 0;
        var heightLeft = height(node.left);
        var heightRight = height(node.right);
        node.height = (heightLeft > heightRight ? heightLeft : heightRight) + 1;
        return node.height;
      }

      /**
       * This method is used in balance method.
       * If the node has balance factor -2 (have two left child and null right child)
       * @param node {object} - this node we transform according to the algorithm that I showed before.
       * @returns {object} - new transformed node.
       */
      function rotateRight(node) {
        if (node.left.right != null) {
          var newNode = node;
          node = newNode.left.right;
          newNode.left.right = null;
          node.left = newNode.left;
          changeHeight(node.left);
          newNode.left = null;
          node.right = newNode;
          changeHeight(node.right);
        } else {
          var newNode = node;
          node = newNode.left;
          newNode.left = null;
          node.right = newNode;
        }
        changeHeight(node);
        changeHeight(newNode);
        return node;
      }

      /**
       * This method is used in balance method.
       * If the node has balance factor 2 (have two right child and null left child)
       * @param node {object} - this node we transform according to the algorithm that I showed before.
       * @returns {object} - new transformed node.
       */
      function rotateLeft(node) {
        if (node.right.left) {
          var newNode = node;
          node = newNode.right.left;
          newNode.right.left = null;
          node.right = newNode.right;
          changeHeight(node.right);
          newNode.right = null;
          node.left = newNode;
          changeHeight(node.left);
        } else {
          var newNode = node;
          node = newNode.right;
          newNode.right = null;
          node.left = newNode;
        }
        changeHeight(node);
        changeHeight(newNode);
        return node;
      }

      /**
       * This method balance a part of tree when we add new elements.
       * @param node {object} - part of tree that we have to balance.
       * @returns {object} - new balanced part of tree.
       */
      function balance(node){
        changeHeight(node);
        if (balanceFactor(node) == 2) {
          return rotateLeft(node);
        }
        if (balanceFactor(node) == -2) {
          return rotateRight(node);
        }
        return node;
      }

      /**
       * This method add element to the tree with balancing the part of tree.
       * @param node {object} - node where we add the element
       * @param side {string} - the part of tree, where we add the element
       * @returns {object} - new tree
       */
      function addWithBalancing(node, side) {
        if (this.parent(node.value)) {
          var parentNode = this.parent(node.value);
          var resultNode = balance(parentNode);
          parentNode = this.parent(parentNode.value);
          if (parentNode == null) {
            this.root = resultNode;
          } else if (side == "left") {
            parentNode.left = resultNode;
          } else {
            parentNode.right = resultNode;
          }
        }
        return this.root;
      }

      /** ----------------------------------------
       *  The public methods.
       *  ----------------------------------------
       */

      /**
       * Method ror adding element to tree. This method use balancing of tree.
       * @param value {number} - element that we want add to the tree.
       * @returns {{value: *, left: null, right: null, height: number}|*} - return all tree.
       */
      this.add = function(value){
        "use strict";
        var currentNode, node = { value : value, left  : null, right : null, height: 1 };
        if (this.root === null) {
          this.root = node;
        } else {
          currentNode = this.root;
          while (true) {
            if (value < currentNode.value) {
              if (currentNode.left === null) {
                currentNode.left = node;
                addWithBalancing(currentNode, "left");
                break;
              } else {
                currentNode = currentNode.left;
              }
            } else if (value > currentNode.value) {
              if (currentNode.right === null) {
                currentNode.right = node;
                addWithBalancing(currentNode, "right");
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

      /**
       * Check whether the element is located in the tree.
       * @param value {number} - the element, that we find
       * @param node {object} - the tree or the part of tree, where we search the element.
       * @returns {object} - the node of this element if element exist. False if element isn't exist.
       */
      this.contains = function(value, node){
        "use strict";
        if (node === null) return false;
        if (node.value == value) return node;
        else if (value < node.value) return this.contains(value, node.left);
        else return this.contains(value, node.right);
      };

      /**
       * The method that find minimum element in the tree.
       * @returns {number} - the minimum element.
       */
      this.findMin = function () {
        var current_node = this.root;
        while (current_node.left) current_node = current_node.left;
        return current_node.value;
      };

      /**
       * The method that find maximum element in the tree.
       * @returns {number} - the maximum element.
       */
      this.findMax = function () {
        var current_node = this.root;
        while (current_node.right) current_node = current_node.right;
        return current_node.value;
      };

      /**
       * The method for sorting array (asc) and printing it to console.
       * @param root {object} - the tree or part of tree that we want to sort.
       * @returns {object} - tree.
       */
      this.sort = function(root) {
        if (root.left != null) { this.sort(root.left);}
        console.log(root.value);
        if (root.right != null) { this.sort(root.right);}
        return root;
      };

      /**
       * The method for searching the parent node for element
       * @param value {number} - for this element we search the parent node.
       * @returns {object} - parent node.
       */
      this.parent = function (value) {
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

      /**
       * This method delete the element from the tree.
       * @param value {number} - element that we want to remove
       * @returns {boolean} - whether the element is removed from tree.
       */
      this.remove = function(value) {
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

      this.root = null;
      var _this = this;
      array.forEach(function(el,i){
        _this.add(el);
      });
      return this;
    };
})(window, document);
