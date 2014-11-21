(function (global, document) {
  "use strict";
  global.GOLModel = function GOLModel(size, data) {
    var that = this;


    function init(){
      GOL.call(that);
      that.setData(size, data);
    }

    init();
    return this;
  };

  function parseData(data){
    if (typeof data === 'string') {
      return data.split("\n").map(function (el) {
        if (el) {
          var coordinates = el.split(" ");
          //if (parseFloat(coordinates[0]) && parseFloat(coordinates[1])) {
            return [parseFloat(coordinates[0]), parseFloat(coordinates[1])];
          //}
        }
      });
    } else {
      return data;
    }
  }

  GOLModel.prototype = Object.create(GOL.prototype);

  GOLModel.prototype.setRandom = function () {
    var that = this;
    this.liveCells = [];
    this.cells = Array.apply(null, {length: that.size.xLength + 10})
      .map(function(el, i){
        return Array.apply(null, {length: that.size.yLength + 10})
          .map(function(el, j){
            var randomValue = Math.random()*100;
            if (randomValue > 75){
              that.liveCells.push([j - that.size.yLength / 2, i - that.size.xLength / 2]);
              return 1;
            }
            return 0;
          });
      });
    that.trigger('dataChanged', [that.liveCells]);
    return this;
  };

  GOLModel.prototype.setData = function (size, data){
    size = size || this.size || {xLength: 100, yLength: 100};
    data = data || [];
    var liveCellsData = parseData(data);
    this.setCells(size, liveCellsData);
  }

})(window, document);
