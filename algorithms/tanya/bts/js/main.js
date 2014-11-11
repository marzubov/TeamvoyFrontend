(function () {
    var treeExample = new BinaryTree([6,1,7]);
    console.log("add 5", treeExample.add(5));
    console.log("add 8", treeExample.add(8));
    console.log("add 7", treeExample.add(7));
    console.log("add 2", treeExample.add(2));
    console.log("add 10", treeExample.add(10));
    console.log("parent 10", treeExample.parent(10));
    console.log("remove 7", treeExample.remove(7));

    console.log("contains 7", treeExample.contains(7, treeExample.root));
    console.log("contains 10", treeExample.contains(10, treeExample.root));

    console.log("min", treeExample.findMin());
    console.log("max", treeExample.findMax());
    console.log("sort"); treeExample.sort(treeExample.root);
})();
