function BTS(node, key){
  return (!node) || (key == node.key) ? node : key < node.key ? BTS(node.left, key) : BTS(node.right, key);
}
