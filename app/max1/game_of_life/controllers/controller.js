(function () {
  "use strict";
  var firstGOLModel, firstGOLView, intervalID,
    firstGrid = document.getElementById('firstGrid');
  firstGOLModel = new GOLModel();
  firstGOLView = new GOLView(firstGrid).createCells(100, 100).renderCells(firstGOLModel.cells);
  firstGOLModel.on('dataChanged', function (liveCells) {
    firstGOLView.renderData.call(firstGOLView, liveCells, firstGOLModel.size);
    firstGOLView.renderCells.call(firstGOLView, firstGOLModel.cells);
  });

  function stopInterval (){
    if (intervalID) {
      clearInterval(intervalID);
      intervalID = null;
    }
  }

  document.getElementById("step")
    .addEventListener('click', function () {
      stopInterval();
      firstGOLModel.nextGeneration.call(firstGOLModel);
      firstGOLView.renderCells.call(firstGOLView, firstGOLModel.cells);
    });

  document.getElementById("change")
    .addEventListener('click', function () {
      stopInterval();
      firstGOLModel.setData({
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
          firstGOLModel.nextGeneration.call(firstGOLModel);
        }, speed);
      }
    });
  document.getElementById("stop")
    .addEventListener('click', stopInterval);

  document.getElementById("random")
    .addEventListener('click', function () {
      stopInterval();
      firstGOLModel.setRandom();
    });
  document.getElementById("clear")
    .addEventListener('click', function () {
      stopInterval();
      firstGOLModel.setData();
    });
})();

