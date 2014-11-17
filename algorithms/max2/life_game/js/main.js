(function (document, window) {
  "use strict";
  var myUniverse = window.myUniverse = new Life(document.querySelector('.universe'), 2000);
  myUniverse.addLife(26, 10);
  myUniverse.addLife(27, 10);
  myUniverse.addLife(25, 10);
  myUniverse.addLife(27, 11);
  myUniverse.addLife(26, 12);
})(document, window);
