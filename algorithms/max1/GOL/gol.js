(function (global, document) {
  "use strict";
  global.GOL = function GOL() {
    //EventMachine.call(this);
    function init() {
      console.log('init');
    }

    init();
    return this;
  };
  GOL.prototype.createArray = function createArray(length1, length2) {
    return Array.apply(null, {length: length1})
      .map(function () {
        return Array.apply(null, {length: length2})
          .map(function (el, i) {
            if (i % 5 === 0) {
              return 1;
            }
            return 0;
          });
      });
  };
  GOL.prototype.universe = [[]];
  GOL.prototype.createUniverse = function createUniverse(config) {
    this.universe = this.createArray(config.length1, config.length2);
    console.log('created', this.universe);
  };
  GOL.prototype.clearUniverse = function clearUniverse() {
    console.log('cleared');
  };
  GOL.prototype.nextGen = function nextGen() {
    console.log('nextGen');
  };
})(window, document);
