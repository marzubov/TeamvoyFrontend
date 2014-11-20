(function () {
  "use strict";
  var firstGOL, firstGOLView, intervalID,
    firstGrid = document.getElementById('firstGrid');
  firstGOL = new GOL().setCells({
    xLength: 100,
    yLength: 100
  },
    "12 15");
  firstGOLView = new GOLView(firstGrid).createCells(100, 100).renderCells(firstGOL.cells);
  firstGOL.on('dataChanged', function (cells) {
    document.getElementById('patternText').value = cells;
    firstGOLView.renderCells.call(firstGOLView, firstGOL.cells);
  });

  document.getElementById("step")
    .addEventListener('click', function () {
      firstGOL.nextGeneration.call(firstGOL);
      firstGOLView.renderCells.call(firstGOLView, firstGOL.cells);
    });

  document.getElementById("change")
    .addEventListener('click', function () {
      firstGOL.setCells({
        xLength: 100,
        yLength: 100
      },
        document.getElementById('patternText').value);
    });
  document.getElementById("run")
    .addEventListener('click', function () {
      var speed = document.getElementById('speed')
        .options[document.getElementById('speed').selectedIndex].value;
      if (!intervalID) {
        intervalID = setInterval(function () {
          firstGOL.nextGeneration.call(firstGOL);
        }, speed);
      }
    });
  document.getElementById("stop")
    .addEventListener('click', function () {
      if (intervalID) {
        clearInterval(intervalID);
        intervalID = null;
        firstGOL.trigger('dataChanged', [firstGOL.cells]);
      }
    });
})();

