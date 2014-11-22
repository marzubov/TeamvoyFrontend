(function () {
    var treeExample = new BinaryTree([6,1,7,5,8,2,10]);
    console.log("add 7", treeExample.add(7));
    console.log("tree", treeExample.root);
    console.log("parent 7", treeExample.parent(7));
    console.log("remove 7", treeExample.remove(7));

    console.log("contains 7", treeExample.contains(7, treeExample.root));
    console.log("contains 10", treeExample.contains(10, treeExample.root));

    console.log("min", treeExample.findMin());
    console.log("max", treeExample.findMax());
    console.log("sort"); treeExample.sort(treeExample.root);
})();
