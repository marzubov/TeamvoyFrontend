(function (document, window) {
  window.BalancedBinaryTree = function () {
    var that = this;
    BalancedBinaryTree.superclass.constructor.call(this);

    this.perfectBalance = function () {
      var array = this.toArray();
      var result = [];

      //recoursiv call
      function findRoot(dataArray) {
        if (dataArray.length > 2) {
          result.push(dataArray[(dataArray.length / 2) >> 0]);
          findRoot(dataArray.slice(0, (dataArray.length / 2)));
          findRoot(dataArray.slice((dataArray.length / 2) + 1));
        } else {
          dataArray.forEach(function (el) {
            result.push(el);
          });
        }
      }

      findRoot(array);

      console.log(result);
    };
    // Self reBalance
    this.on('add', function (el) {
      that.perfectBalance();
      console.log('height', that.height);
    });
  };
  BalancedBinaryTree.extend(BinaryTree);
})(document, window);
