var thirdLeftRow = new BalancedBinaryTree(8);
var thirdRightRow = new BalancedBinaryTree(12);

var secondLeftRow = new BalancedBinaryTree(10, thirdLeftRow, thirdRightRow);
var secondRightRow = new BalancedBinaryTree(20);

var tree = new BalancedBinaryTree(15, secondLeftRow, secondRightRow);