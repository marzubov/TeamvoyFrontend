(function (document, window) {
  "use strict";
  var myUniverse = window.myUniverse = new Life(document.querySelector('.universe'), 100);
  myUniverse.addLife(26, 20);
  myUniverse.addLife(27, 20);
  myUniverse.addLife(25, 20);
  myUniverse.addLife(27, 21);
  myUniverse.addLife(26, 22);

})(document, window);
