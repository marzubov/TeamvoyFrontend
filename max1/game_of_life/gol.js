(function (global, document) {
  "use strict";
  global.GOL = function GOL(canvas, grid) {
    //EventMachine.call(this);
    this.canvas = canvas;
    this.grid = grid;
    this.universe = [[]];
    this.intervalID = null;

    return this;
  };
  GOL.prototype.createArray = function createArray(length1, length2) {
    return Array.apply(null, {length: length1})
      .map(function () {
        return Array.apply(null, {length: length2})
          .map(function () {
            return 0;
          });
      });
  };

  GOL.prototype.createRandom = function createRandom() {
    var that = this;
    this.universe = this.universe.map(function (row, i) {
      return row.map(function (el, j) {
        var aliveNeighboursCount = that.checkNeighbours(i, j);
        if (Math.random() * 100 > 75) {
          return 1;
        }
        return 0;
      });
    });
    this.showUniverse();
    return this.universe;
  };

  GOL.prototype.createUniverse = function createUniverse(config) {
    while (this.grid.firstChild) {
      this.grid.removeChild(this.grid.firstChild);
    }
    this.universe = this.createArray(config.length1, config.length2);
    this.createCells(config.length1, config.length2);
    this.showUniverse();
  };
  GOL.prototype.gun = function () {
    var that = this,
      txtFile = new XMLHttpRequest();
    txtFile.open("GET", "gosper_glider_gun.txt", true);
    txtFile.onreadystatechange = function () {
      if (txtFile.readyState === 4) {  // document is ready to parse.
        if (txtFile.status === 200) {  // file is found
          var allText = txtFile.responseText;
          var lines = txtFile.responseText.split("\n");
          lines.forEach(function (el) {
            if (el) {
              var coordinates = el.split(" ");
              that.universe[parseFloat(coordinates[1]) + 50][parseFloat(coordinates[0]) + 50] = 1;
            }
          });
          that.showUniverse();
        }
      }
    };
    txtFile.send(null);
  };
  GOL.prototype.patternFromText = function (text) {
    var that = this, lines = text.split("\n");
    lines.forEach(function (el) {
      if (el) {
        var coordinates = el.split(" ");

        if ((parseFloat(coordinates[0] + 50)) && (parseFloat(coordinates[1] + 50))) {
          that.universe[parseFloat(coordinates[1]) + 50][parseFloat(coordinates[0]) + 50] = 1;
        }
      }
    });
    that.showUniverse();
  };
  GOL.prototype.createCells = function (length1, length2) {
    var i, j,
      frag = document.createDocumentFragment(),
      cell = document.createElement('div'),
      cellWidth = (this.grid.offsetWidth - 2) / length1 - 2 + 'px',
      cellHeight = (this.grid.offsetHeight - 2) / length2 - 2 + 'px';
    for (i = 0; i < length1; i = i + 1) {
      for (j = 0; j < length2; j = j + 1) {
        cell = document.createElement('div');
        cell.classList.add('cell');
        cell.style.width = cellWidth;
        cell.style.height = cellHeight;
        cell.x = i;
        cell.y = j;
        frag.appendChild(cell);
      }
    }
    this.grid.appendChild(frag);
  };

  GOL.prototype.clearUniverse = function clearUniverse(config) {
    this.universe = this.createArray(config.length1, config.length2);
    this.showUniverse();
  };

  GOL.prototype.nextGen = function nextGen() {
    var that = this;
    this.universe = this.universe.map(function (row, i) {
      return row.map(function (el, j) {
        var aliveNeighboursCount = that.checkNeighbours(i, j);
        if (el === 1) {
          if ((aliveNeighboursCount !== 2) && (aliveNeighboursCount !== 3)) {
            return 0;
          }
          return 1;
        } else {
          if (aliveNeighboursCount === 3) {
            return 1;
          }
          return 0;
        }
      });
    });
    this.showUniverse();
    return this.universe;
  };
  GOL.prototype.checkNeighbours = function checkNeighbours(x, y) {
    var i,
      neighbours = [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1], [x - 1, y], [x + 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]],
      aliveNeighboursCount = 0;
    for (i = 0; i < 8; i = i + 1) {
      if (this.universe[neighbours[i][0]]) {
        if (this.universe[neighbours[i][0]][neighbours[i][1]]) {
          aliveNeighboursCount = aliveNeighboursCount + 1;
        }
      }
    }
    return aliveNeighboursCount;
  };

  GOL.prototype.showUniverse = function showUniverse() {
    var that = this;
    //ctx = this.canvas.getContext('2d'),
    //  cellWidth = this.canvas.offsetWidth / this.universe.length,
    //  cellHeight = this.canvas.offsetHeight / this.universe.length;
    //ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.universe.forEach(function (row, i) {
      row.forEach(function (el, j) {
        if (el === 1) {
          //ctx.fillRect(cellWidth * j, cellHeight * i, cellWidth, cellHeight);
          that.grid.childNodes[i * row.length + j].classList.remove('inactive');
          that.grid.childNodes[i * row.length + j].classList.add('active');
        } else {
          that.grid.childNodes[i * row.length + j].classList.remove('active');
          that.grid.childNodes[i * row.length + j].classList.add('inactive');
        }
      });
    });

    GOL.prototype.startInterval = function startInterval(speed) {
      var that = this;
      if (!this.intervalID) {
        this.intervalID = setInterval(function () {
          that.nextGen.call(that);
        }, speed);
      }
    };

    GOL.prototype.stopInterval = function stopInterval() {
      if (this.intervalID) {
        clearInterval(this.intervalID);
        this.intervalID = null;
      }
    };
    return this.universe;
  }
})(window, document);
