(function (document, window) {
  "use strict";
  var myUniverse = window.myUniverse = new Life(document.querySelector('.universe'));

  function createGlider() {
    myUniverse.addLife(20, 20);
    myUniverse.addLife(21, 20);
    myUniverse.addLife(19, 20);
    myUniverse.addLife(21, 21);
    myUniverse.addLife(20, 22);
  }

  function createSpaceship() {
    myUniverse.addLife(6, 6);
    myUniverse.addLife(6, 7);
    myUniverse.addLife(6, 8);
    myUniverse.addLife(5, 8);
    myUniverse.addLife(4, 8);
    myUniverse.addLife(3, 8);
    myUniverse.addLife(5, 5);
    myUniverse.addLife(2, 5);
    myUniverse.addLife(2, 7);
  }

  document.querySelector('.stop').addEventListener('click', function () {
    myUniverse.stop();
  });
  document.querySelector('.start').addEventListener('click', function () {
    myUniverse.start();
  });
  document.querySelector('.clear').addEventListener('click', function () {
    myUniverse.clear();
  });
  document.querySelector('.next_generation').addEventListener('click', function () {
    myUniverse.nextGeneration();
  });
  document.querySelector('.random').addEventListener('click', function () {
    myUniverse.randomLife();
  });
  document.querySelector('.color').addEventListener('change', function (e) {
    myUniverse.color = e.target.value;
  });
  document.querySelector('.glider').addEventListener('click', createGlider);
  document.querySelector('.spaceship').addEventListener('click', createSpaceship);

})(document, window);
