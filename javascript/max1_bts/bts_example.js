var node = {
  key: 7,
  left: {
    key:5,
    left:{},
    right:{}
  },
  right: {
    key:9,
    left:{},
    right:{}
  }
};
var bts = BTS;

console.log(bts(node, 9));
