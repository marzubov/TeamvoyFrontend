(function () {
    var treeExample = new BinaryTree();
    console.log("add 5", treeExample.add(5));
    console.log("add 8", treeExample.add(8));
    console.log("add 7", treeExample.add(7));
    console.log("add 2", treeExample.add(2));
    console.log("add 10", treeExample.add(10));

    console.log("contains 2", treeExample.contains(2, treeExample.root));
    console.log("contains 4", treeExample.contains(4, treeExample.root));

    console.log("min", treeExample.findMin());
    console.log("max", treeExample.findMax());
    console.log("sort"); treeExample.sort(treeExample.root);
})();
