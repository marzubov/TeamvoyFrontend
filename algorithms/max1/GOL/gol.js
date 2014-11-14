(function (global, document) {
  "use strict";
  global.GOL = function GOL() {
    //EventMachine.call(this);
    function init() {
      console.log('init');
    }

    init();
    return this;
  };
  GOL.prototype.createArray = function createArray(length1, length2) {
    return Array.apply(null, {length: length1})
      .map(function () {
        return Array.apply(null, {length: length2})
          .map(function (el, i) {
            if (i % 5 === 0) {
              return 1;
            }
            return 0;
          });
      });
  };
  GOL.prototype.universe = [[]];
  GOL.prototype.createUniverse = function createUniverse(config) {
    this.universe = this.createArray(config.length1, config.length2);
    console.log('created', this.universe);
  };
  GOL.prototype.clearUniverse = function clearUniverse() {
    console.log('cleared');
  };
  GOL.prototype.nextGen = function nextGen() {
    console.log('nextGen');
  };
  GOL.prototype.checkNeighbours = function checkNeighbours(x, y) {
    var i,
      neighbours = [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1], [x - 1, y], [x + 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]],
      aliveNeighboursCount = 0;
    for (i = 0; i < 8; i++) {
      if (this.universe[neighbours[i][0]]) {
        if (this.universe[neighbours[i][0]][neighbours[i][1]]) {
          aliveNeighboursCount = aliveNeighboursCount + 1;
        }
      }
    }
    console.log(aliveNeighboursCount);
    return aliveNeighboursCount;
  }
})(window, document);
