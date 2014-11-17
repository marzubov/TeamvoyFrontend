(function (document, window) {
  "use strict";
  var myUniverse = window.myUniverse = new Life(document.querySelector('.universe'), 2);
  myUniverse.addLife(25, 10);
  myUniverse.addLife(25, 11);
  myUniverse.addLife(25, 12);
})(document, window);
