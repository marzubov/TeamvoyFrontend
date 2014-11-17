(function (document, window) {
  "use strict";
  var columns = 50, rows = 20;
  window.Life = function (container, speed) {
    var liveCells = [];
    this.speed = speed;
    this.addLife = function (positionX, positionY) {
      var cell = this.getCellByPosition(positionX, positionY);
      cell.classList.remove('dead');
      cell.classList.add('alive');
      liveCells.push(cell);
    };
    this.start = function () {
      while (true) {
        setTimeout(this.makeStep(), speed);
      }
    };
    this.getCellByPosition = function (positionX, positionY) {
      var index = (rows - positionY - 1) * columns + positionX;
      return container.childNodes[index];
    };
    this.makeStep = function () {
      Array.prototype.slice.call(container.childNodes).forEach(function (el) {
        el.neighbours = 0;
      });
      markNeighbours();
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
        }
        if (el.classList.contains('alive')) {
          liveCells.push(el);
        }
      });
    }

    function markNeighbours() {
      liveCells.forEach(function (el) {
        markCell(container.childNodes[el.index + 1]);
        markCell(container.childNodes[el.index - 1]);

        markCell(container.childNodes[el.index - columns]);
        markCell(container.childNodes[el.index - columns - 1]);
        markCell(container.childNodes[el.index - columns + 1]);

        markCell(container.childNodes[el.index + columns]);
        markCell(container.childNodes[el.index + columns - 1]);
        markCell(container.childNodes[el.index + columns + 1]);
      });
    }

    function markCell(cell) {
      cell.neighbours += 1;
    }

    function createUniverse() {
      var cell, i = 0;
      for (i; i < columns * rows; i += 1) {
        cell = document.createElement('div');
        cell.classList.add('cell', 'dead');
        cell.index = i;
        container.appendChild(cell);
      }
    }

    createUniverse();
  };
})(document, window);
