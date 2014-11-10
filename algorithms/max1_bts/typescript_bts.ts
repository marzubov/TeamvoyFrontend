class NodeCoordinates{
  x: number;
  y: number;
  constructor(xCoordinate: number, yCoordinate: number) {
    this.x = xCoordinate || 0;
    this.y = yCoordinate || 0;
    return this;
  }
}

class TreeNode extends NodeCoordinates {
  key: string;
  leftChild: TreeNode;
  rightChild: TreeNode ;
  value: Object;
  parent: TreeNode;
  constructor(key:string, leftChild:TreeNode, rightChild:TreeNode,
              parent:TreeNode, value:Object, x:number, y:number) {
    super(x,y);
    this.key = key;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.value = value;
    this.parent = parent;
    return this;
  }
}

class BST {

  root: TreeNode;
  constructor() {
    this.root = new TreeNode(null,null,null,null, null ,null, null);
    return this;
  }

  search(node: TreeNode, key: string){
    return (!node) || (key == node.key) ? node : parseFloat(key) < parseFloat(node.key)
      ? this.search(node.leftChild, key) : this.search(node.rightChild, key);
  }

  insert(node: TreeNode, key: string, parent: TreeNode, deep: number){
    if (!node.key) {
      node.key = key;
      node.leftChild = new TreeNode(null,null,null,null, null ,0, 0);
      node.rightChild = new TreeNode(null,null,null,null, null ,0, 0);
      node.parent = parent;
      if (parseFloat(key) < parseFloat(parent.key)) {
        node.x = parent.x- 1 - deep;
        node.y = parent.y + 1;
      }
      else if (parseFloat(key) > parseFloat(parent.key)) {
        node.x = parent.x + 1 + deep;
        node.y = parent.y + 1;
      }
      return node;
    }
    else if (parseFloat(key) < parseFloat(node.key)) return this.insert(node.leftChild, key, node, deep / 2);
    else if (parseFloat(key) > parseFloat(node.key)) return this.insert(node.rightChild, key, node, deep / 2);
    else console.log('same node');
  }

  findMin(node: TreeNode){
    node = node || this.root;
    if ((node.leftChild) && (node.leftChild.key)) return this.findMin(node.leftChild);
    else return node;
  }

  findMax(node: TreeNode){
    node = node || this.root;
    if ((node.rightChild) && (node.rightChild.key)) return this.findMax(node.rightChild);
    else return node;

  }

  static replaceNodeInParent(node: TreeNode, newNode: TreeNode){
    if (node.parent) {
      if (node.parent.leftChild == node) node.parent.leftChild = newNode;
      else node.parent.rightChild = newNode;
    }
    if (newNode) newNode.parent = node.parent;
  }

  remove(node: TreeNode, key:string){
    if (parseFloat(key) < parseFloat(node.key))this.remove(node.leftChild, key);
    else if (parseFloat(key) > parseFloat(node.key))this.remove(node.rightChild, key);
    else if ((node.leftChild.key) && (node.rightChild.key)) {
      var successor = this.findMin(node.rightChild);
      node.key = successor.key;
      this.remove(successor, successor.key);
    } else if (node.leftChild.key) BST.replaceNodeInParent(node, node.leftChild);
    else if (node.rightChild.key) BST.replaceNodeInParent(node, node.rightChild);
    else BST.replaceNodeInParent(node, null);
  }

  traverse(node: TreeNode, callback: Function){
    node = node || this.root;
    if (node.key) {
      this.traverse(node.leftChild, callback);
      callback(node.key);
      this.traverse(node.rightChild, callback);
    }
    return true;
  }

  successor(node: TreeNode){
    node = node || this.root;
    if (node.rightChild.key) return this.findMin(node.rightChild);

    var parent = node.parent;
    while (parent.key && node == parent.rightChild) {
      node = parent;
      parent = parent.parent;
    }
    return parent.key;
  }

  predecessor(node: TreeNode) {
    node = node || this.root;
    if (node.leftChild.key) return this.findMax(node.leftChild);

    var parent = node.parent;
    while (parent.key && node == parent.leftChild) {
      node = parent;
      parent = parent.parent;
    }
    return parent.key;
  }

  sort(node: TreeNode){
    node = node || this.root;
    var result = [];
    this.traverse(node, function (element) {
      result.push(element);
    });
    return result;
  }

  generateFromArray(data: Array<number>){
    this.root = new TreeNode(null,null,null,null, null ,0, 0);
    for (var i = 0; i < data.length; i++) {
      var edgeLength = data.length;
      this.insert(this.root, data[i].toString(), this.root, edgeLength/2);
    }
    return this;
  }

  generateRandom(count: number){
    return this.generateFromArray(Array.apply(null, {length: count})
      .map(function () {
        return Math.floor(Math.random() * 100);
      }));
  }
}
