(function(global, document) {
    global.BinaryTree = function BinaryTree(){
        this.root = {};
    };

    BinaryTree.prototype.add = function(value){
        "use strict";
        var currentNode, node = {
            value : value,
            left  : null,
            right : null
            };

        if (!this.root) {
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

    BinaryTree.prototype.contains = function(value){
        "use strict";
        var isFound = false,
            currentNode = this.root;
        while(!isFound && currentNode){
            if (value < currentNode.value){
                currentNode = currentNode.left;
            } else if (value > currentNode.value){
                currentNode = currentNode.right;
            } else {
                isFound = true;
            }
        }
        return isFound;
    };
})(window, document);