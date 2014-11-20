(function (global, document) {
  "use strict";
  global.GOLView = function GOLView(container) {
    this.grid = container;
    return this;
  };
  GOLView.prototype.createCells = function (xLength, yLength) {
    var i, j,
      frag = document.createDocumentFragment(),
      cell = document.createElement('div'),
      cellWidth = (this.grid.offsetWidth - 2) / xLength - 2 + 'px',
      cellHeight = (this.grid.offsetHeight - 2) / yLength - 2 + 'px';
    for (i = 0; i < xLength; i = i + 1) {
      for (j = 0; j < yLength; j = j + 1) {
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
    return this;
  };
  GOLView.prototype.renderCells = function renderCells(cells) {
    var that = this;
    cells.forEach(function (row, i) {
      row.forEach(function (el, j) {
        if ((i >= (row.length - 10) + 5) || (j >= (cells.length - 10) + 5) || (i < 5) || (j < 5)) {
          return;
        }
        if (el === 1) {
          that.grid.childNodes[(i - 5) * (row.length - 10) + (j - 5)].classList.remove('inactive');
          that.grid.childNodes[(i - 5) * (row.length - 10) + (j - 5)].classList.add('active');
        } else {
          that.grid.childNodes[(i - 5) * (row.length - 10) + (j - 5)].classList.remove('active');
          that.grid.childNodes[(i - 5) * (row.length - 10) + (j - 5)].classList.add('inactive');
        }
      });
    });
    return this;
  };
})(window, document);
