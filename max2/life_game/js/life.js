(function (document, window) {
  "use strict";
  var columns = 70, rows = 70;
  window.Life = function (container) {
    var intervalThread,
      liveCells = [],
      that = this,
      addNeighbours = markNeighbours;
    this.speed = 10;
    this.color = '#bdc3c7';
    this.clear = function () {
      this.stop();
      liveCells = [];
      Array.prototype.slice.call(container.childNodes).forEach(function (el) {
        el.classList.remove('alive');
        el.classList.add('dead');
      });
      return this;
    };
    this.activateInfinityField = function () {
      this.clear();
      addNeighbours = experimentalInfiniteField;
    };
    this.randomLife = function () {
      Array.prototype.slice.call(container.childNodes).forEach(function (el) {
        if (Math.random() > 0.6) {
          makeAlive(el);
          liveCells.push(el);
        }
      });
      return this;
    };

    this.addLife = function (positionX, positionY) {
      var cell = this.getCellByPosition(positionX, positionY);
      makeAlive(cell);
      liveCells.push(cell);
      return this;
    };

    this.start = function () {
      if (intervalThread) {
        clearInterval(intervalThread);
      }
      intervalThread = setInterval(this.nextGeneration, 1000 / this.speed);
      return this;
    };

    this.stop = function () {
      clearInterval(intervalThread);
    };

    this.getCellByPosition = function (positionX, positionY) {
      var index = positionY * columns + positionX;
      return container.childNodes[index];
    };

    this.nextGeneration = function () {
      Array.prototype.slice.call(container.childNodes).forEach(function (el) {
        el.neighbours = 0;
      });
      addNeighbours();
      evolve();
      return this;
    };

    function evolve() {
      liveCells.forEach(function (el) {
        if (el.neighbours === 1 || !el.neighbours) {
          el.classList.remove('alive');
          el.classList.add('dead');
        } else if (el.neighbours > 3) {
          el.classList.remove('alive');
          el.classList.add('dead');
        }
      });
      liveCells = [];
      Array.prototype.slice.call(container.childNodes).forEach(function (el) {
        if (el.neighbours === 3) {
          el.classList.remove('dead');
          el.classList.add('alive');
          if (el.style.backgroundColor !== el.color) {
            el.style.backgroundColor = el.color;
          }
        }
        if (el.classList.contains('alive')) {
          liveCells.push(el);
        }
      });
    }

    function experimentalInfiniteField() {
      liveCells.forEach(function (el) {
        var neighbours = {
            up: el.index - columns < 0 ? rows * (columns - 1) + el.index : el.index - columns,
            left: el.index - 1,
            right: el.index + 1,
            down: el.index + columns > (rows * columns) - 1 ? el.index - rows * (columns - 1) : el.index + columns,
            leftUp: el.index - columns - 1 < 0 ? (rows * (columns - 1) + el.index) - 1 : el.index - columns - 1,
            rightUp: el.index - columns + 1 < 0 ? (rows * (columns - 1) + el.index) + 1 : el.index - columns + 1,
            leftDown: el.index + columns - 1 > (rows * columns) - 1 ? el.index - rows * (columns - 1) - 1 : el.index + columns - 1,
            rightDown: el.index + columns + 1 > (rows * columns) - 1 ? el.index - rows * (columns - 1) + 1 : el.index + columns + 1
          },
          neighbour;
        for (neighbour in neighbours) {
          if (neighbours.hasOwnProperty(neighbour)) {
            countNeighbours(container.childNodes[neighbours[neighbour]], el);
          }
        }
      });
    }

    function markNeighbours() {
      liveCells.forEach(function (el) {
        var neighbours = {
            up: el.index - columns,
            left: el.index - 1,
            right: el.index + 1,
            down: el.index + columns,
            leftUp: el.index - columns - 1,
            rightUp: el.index - columns + 1,
            leftDown: el.index + columns - 1,
            rightDown: el.index + columns + 1
          },
          neighbour;
        for (neighbour in neighbours) {
          if (neighbours.hasOwnProperty(neighbour)) {
            countNeighbours(container.childNodes[neighbours[neighbour]], el);
          }
        }
      });
    }

    function countNeighbours(cell, neighbour) {
      if (cell) {
        cell.neighbours += 1;
        cell.color = neighbour.style.backgroundColor;
      }
    }

    function createUniverse() {
      var cell, i = 0;
      for (i; i < columns * rows; i += 1) {
        cell = document.createElement('div');
        cell.classList.add('cell', 'dead');
        cell.index = i;
        container.appendChild(cell);
      }
      listenEvents();
    }

    function makeAlive(cell) {
      cell.classList.remove('dead');
      cell.classList.add('alive');
      cell.style.backgroundColor = that.color;
    }
    function listenEvents() {
      container.addEventListener('click', function (e) {
        e.target.classList.toggle('dead');
        e.target.classList.toggle('alive');
        e.target.style.backgroundColor = that.color;
        liveCells.push(e.target);
      });
    }

    createUniverse();
  };
})(document, window);
