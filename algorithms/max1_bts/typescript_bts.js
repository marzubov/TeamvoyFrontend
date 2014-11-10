var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var NodeCoordinates = (function () {
    function NodeCoordinates(xCoordinate, yCoordinate) {
        this.x = xCoordinate || 0;
        this.y = yCoordinate || 0;
        return this;
    }
    return NodeCoordinates;
})();
var TreeNode = (function (_super) {
    __extends(TreeNode, _super);
    function TreeNode(key, leftChild, rightChild, parent, value, x, y) {
        _super.call(this, x, y);
        this.key = key;
        this.leftChild = leftChild;
        this.rightChild = rightChild;
        this.value = value;
        this.parent = parent;
        return this;
    }
    return TreeNode;
})(NodeCoordinates);
var BST = (function () {
    function BST() {
        this.root = new TreeNode(null, null, null, null, null, null, null);
        return this;
    }
    BST.prototype.search = function (node, key) {
        return (!node) || (key == node.key) ? node : parseFloat(key) < parseFloat(node.key) ? this.search(node.leftChild, key) : this.search(node.rightChild, key);
    };
    BST.prototype.insert = function (node, key, parent, deep) {
        if (!node.key) {
            node.key = key;
            node.leftChild = new TreeNode(null, null, null, null, null, 0, 0);
            node.rightChild = new TreeNode(null, null, null, null, null, 0, 0);
            node.parent = parent;
            if (parseFloat(key) < parseFloat(parent.key)) {
                node.x = parent.x - 1 - deep;
                node.y = parent.y + 1;
            }
            else if (parseFloat(key) > parseFloat(parent.key)) {
                node.x = parent.x + 1 + deep;
                node.y = parent.y + 1;
            }
            return { node: node, parent: parent };
        }
        else if (parseFloat(key) < parseFloat(node.key))
            return this.insert(node.leftChild, key, node, deep / 2);
        else if (parseFloat(key) > parseFloat(node.key))
            return this.insert(node.rightChild, key, node, deep / 2);
        else
            console.log('same node');
    };
    BST.prototype.findMin = function (node) {
        node = node || this.root;
        if ((node.leftChild) && (node.leftChild.key))
            return this.findMin(node.leftChild);
        else
            return node;
    };
    BST.prototype.findMax = function (node) {
        node = node || this.root;
        if ((node.rightChild) && (node.rightChild.key))
            return this.findMax(node.rightChild);
        else
            return node;
    };
    BST.replaceNodeInParent = function (node, newNode) {
        if (node.parent) {
            if (node.parent.leftChild == node)
                node.parent.leftChild = newNode;
            else
                node.parent.rightChild = newNode;
        }
        if (newNode)
            newNode.parent = node.parent;
    };
    BST.prototype.remove = function (node, key) {
        if (parseFloat(key) < parseFloat(node.key))
            this.remove(node.leftChild, key);
        else if (parseFloat(key) > parseFloat(node.key))
            this.remove(node.rightChild, key);
        else if ((node.leftChild.key) && (node.rightChild.key)) {
            var successor = this.findMin(node.rightChild);
            node.key = successor.key;
            this.remove(successor, successor.key);
        }
        else if (node.leftChild.key)
            BST.replaceNodeInParent(node, node.leftChild);
        else if (node.rightChild.key)
            BST.replaceNodeInParent(node, node.rightChild);
        else
            BST.replaceNodeInParent(node, null);
    };
    BST.prototype.traverse = function (node, callback) {
        node = node || this.root;
        if (node.key) {
            this.traverse(node.leftChild, callback);
            callback(node.key);
            this.traverse(node.rightChild, callback);
        }
        return true;
    };
    BST.prototype.successor = function (node) {
        node = node || this.root;
        if (node.rightChild.key)
            return this.findMin(node.rightChild);
        var parent = node.parent;
        while (parent.key && node == parent.rightChild) {
            node = parent;
            parent = parent.parent;
        }
        return parent.key;
    };
    BST.prototype.predecessor = function (node) {
        node = node || this.root;
        if (node.leftChild.key)
            return this.findMax(node.leftChild);
        var parent = node.parent;
        while (parent.key && node == parent.leftChild) {
            node = parent;
            parent = parent.parent;
        }
        return parent.key;
    };
    BST.prototype.sort = function (node) {
        node = node || this.root;
        var result = [];
        this.traverse(node, function (element) {
            result.push(element);
        });
        return result;
    };
    BST.prototype.generateFromArray = function (data) {
        this.root = new TreeNode(null, null, null, null, null, 0, 0);
        for (var i = 0; i < data.length; i++) {
            var edgeLength = data.length;
            this.insert(this.root, data[i].toString(), this.root, edgeLength / 2);
        }
        return this;
    };
    BST.prototype.generateRandom = function (count) {
        return this.generateFromArray(Array.apply(null, { length: count }).map(function () {
            return Math.floor(Math.random() * 100);
        }));
    };
    return BST;
})();
//# sourceMappingURL=typescript_bts.js.map