(function (global, document) {
  "use strict";
  global.GOL = function GOL(canvas) {
    //EventMachine.call(this);
    this.canvas = canvas;
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
            if (i % 2 === 0) {
              return 1;
            }
            return 0;
          });
      });
  };
  GOL.prototype.universe = [[]];
  GOL.prototype.createUniverse = function createUniverse(config) {
    this.universe = this.createArray(config.length1, config.length2);
    this.showUniverse();
    console.log('created', this.universe);
  };
  GOL.prototype.clearUniverse = function clearUniverse() {
    this.universe = this.createArray(config.length1, config.length2);
    console.log('cleared');
  };
  GOL.prototype.nextGen = function nextGen() {
    var that = this;
    this.universe.forEach(function (row, i) {
      row.forEach(function (el, j) {
        var aliveNeighboursCount = that.checkNeighbours(i, j);
        if (el === 1) {
          if (aliveNeighboursCount < 2) {
            that.universe[i][j] = 0;
          } else if (aliveNeighboursCount > 3){
            that.universe[i][j] = 0;
          }
        } else {
          if (aliveNeighboursCount === 3){
            that.universe[i][j] = 1;
          }
        }
      });
    });
    this.showUniverse();
    console.log(this.universe);
    return this.universe;
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
    return aliveNeighboursCount;
  };

  GOL.prototype.showUniverse = function showUniverse() {
    var that = this,
      ctx = this.canvas.getContext('2d'),
      cellWidth = this.canvas.offsetWidth / this.universe.length,
      cellHeight = this.canvas.offsetHeight / this.universe.length;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.universe.forEach(function (row, i) {
      row.forEach(function (el, j) {
        if (el === 1) {
          ctx.fillRect(cellWidth * j, cellHeight * i, cellWidth, cellHeight);
        }
      });
    });
    return this.universe;
  }
})(window, document);
