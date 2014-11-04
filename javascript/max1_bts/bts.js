function BTS(node, key){
  if ((!node) || (key = node.key)) return node;
  return key < node.key ? BTS(node.left, key) : BTS(node.right, key);
}
