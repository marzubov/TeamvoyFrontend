(function (global, document) {
  "use strict";
  global.GOL = function GOL() {
    EventMachine.call(this);
    this.size = {
      xLength: 100,
      yLength: 100
    };
    this.cells = [];
    this.liveCells = [];

    return this;
  };

  GOL.prototype.setCells = function setCells(size, data) {
    var that = this;
    that.liveCells = [];
    this.size = {
      xLength: size.xLength,
      yLength: size.yLength
    };
    this.cells = Array.apply(null, {length: size.xLength + 10})
      .map(function () {
        return Array.apply(null, {length: size.yLength + 10})
          .map(function () {
            return 0;
          });
      });
    this.liveCells = data;
    this.liveCells.forEach(function (liveCell) {
      if (!liveCell) {
        return false;
      }
      that.cells[liveCell[1] + that.size.yLength / 2][liveCell[0] + that.size.xLength / 2] = 1;
    });
    that.trigger('dataChanged', [that.liveCells]);
    return this;
  };

  GOL.prototype.nextGeneration = function nextGeneration() {
    var that = this;
    this.liveCells = [];
    this.cells = this.cells.map(function (row, i) {
      return row.map(function (el, j) {
        var aliveNeighboursCount = that.checkNeighbours(i, j);
        if (el === 1) {
          if ((aliveNeighboursCount !== 2) && (aliveNeighboursCount !== 3)) {
            return 0;
          }
          that.liveCells.push([j - that.size.yLength / 2, i - that.size.xLength / 2]);
          return 1;
        }
        if (aliveNeighboursCount === 3) {
          that.liveCells.push([j - that.size.yLength / 2, i - that.size.xLength / 2]);
          return 1;
        }
        return 0;
      });
    });
    that.trigger('dataChanged', [that.liveCells]);
    return this.cells;
  };

  GOL.prototype.checkNeighbours = function checkNeighbours(x, y) {
    var i,
      neighbours = [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1], [x - 1, y],
        [x + 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]],
      aliveNeighboursCount = 0;
    for (i = 0; i < 8; i = i + 1) {
      if (this.cells[neighbours[i][0]]) {
        if (this.cells[neighbours[i][0]][neighbours[i][1]]) {
          aliveNeighboursCount = aliveNeighboursCount + 1;
        }
      }
    }
    return aliveNeighboursCount;
  };

})(window, document);
