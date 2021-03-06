/**
 * Created by MU on 10/23/14.
 */
(function (global, document) {
  global.Pager = function Pager(pager, maxDataLength, goTo, maxRows) {
    "use strict";

    function renderPages(pager, maxDataLength, goTo, maxRows) {
      if ((maxDataLength / maxRows).toFixed(0) == 1) {
        //pager.parentNode.removeChild(pager);
        pager.innerHTML = '';
        return;
      }
      var pagesString = '<ul class="pagination"><li><a data-page = "previous">&laquo;</a></li>',
          countPages;
      countPages = (maxDataLength % maxRows) ? (maxDataLength / maxRows + 1).toFixed(0) : (maxDataLength / maxRows).toFixed(0);
      for (var i = 1; i <= countPages; i++) {
        pagesString += '<li><a data-page ="' + i.toString() + '">' + i + '</a></li>';
      }
      pager.innerHTML = pagesString + '<li><a data-page = "next">&raquo;</a></li></ul>';
      Array.prototype.slice.call(pager.querySelectorAll('a'))
        .forEach(function (el) {
          if (el.getAttribute('data-page') === '1') {
            el.classList.add('page-active');
          }
          var i = Array.prototype.indexOf.call(el.parentNode.parentNode.children, el.parentNode);
          if ((el.getAttribute('data-page') !== "previous") && (el.getAttribute('data-page') !== "next")) {
            el.hidden = !!((i < (1 - 5)) || (i - 4 > 1));
          }
        });
      pager.addEventListener('click', function (e) {
        pageClick.call(this, e, goTo, maxDataLength, maxRows);
      });
    }

    function pageClick(e, goTo, maxDataLength, maxRows) {
      "use strict";
      var newIndex;
      if (e.target.getAttribute('data-page') === "previous") {
        newIndex = this.querySelector('.page-active').getAttribute('data-page') - 1;
        if (newIndex < 1) return;

      } else if (e.target.getAttribute('data-page') === "next") {
        newIndex = this.querySelector('.page-active').getAttribute('data-page') - 1;
        newIndex += 2;

        if (newIndex > (maxDataLength / maxRows + 1).toFixed(0)) return;
      } else {
        newIndex = e.target.getAttribute('data-page');

      }
      goTo(newIndex);
    }

    this.changePagerSelection = function (pager, index) {
      "use strict";
      //note this index doesn't exactly change selected page in the table, only used for
      Array.prototype.slice.call(pager.querySelectorAll('a'))
        .forEach(function (el) {
          el.classList.remove('page-active');
          var i = Array.prototype.indexOf.call(el.parentNode.parentNode.children, el.parentNode);
          if ((el.getAttribute('data-page') !== "previous") && (el.getAttribute('data-page') !== "next")) {
            el.hidden = !!((i < (index - 5)) || (i - 4 > index));
          }
        });
      var newPage = pager.querySelector('a[data-page="' + index.toString() + '"]');
      newPage.classList.add('page-active');
    }

    renderPages.call(this, pager, maxDataLength, goTo, maxRows);
  };
})(window, document);
