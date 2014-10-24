/**
 * Created by MU on 10/23/14.
 */
function RenderPager(pager, maxDataLength, goTo) {
    "use strict";

    pager.classList.add('my-pager');
    if ((maxDataLength / maxRows).toFixed(0) == 1) {
        pager.parentNode.removeChild(pager);
        return;
    }
    var pagesString = '<a data-page = "first"><--</a>' + '<a data-page = "previous"><-</a>';
    for (var i = 1; i <= (maxDataLength / maxRows).toFixed(0); i++) {
        pagesString += '<a data-page =' + i.toString() + '>' + i + '</a>';
    }

    pager.innerHTML += pagesString + '<a data-page = "next">' + '->' + '</a>' + '<a data-page = "last">' + '-->' + '</a>';

    Array.prototype.slice.call(pager.querySelectorAll('a'))
        .forEach(function (el) {
            el.classList.add('my-page');

            if (el.getAttribute('data-page') === '1') {
                el.classList.add('page-active');
            }
            var i = Array.prototype.indexOf.call(el.parentNode.children, el);
            if ((el.getAttribute('data-page') !== "first") && (el.getAttribute('data-page') !== "previous") && (el.getAttribute('data-page') !== "next") && (el.getAttribute('data-page') !== "last")) {
                el.hidden = !!((i < (1 - 5)) || (i - 4 > 1));
            }
        });
    pager.addEventListener('click', function (e) {
        pageClick.call(this, e, goTo, maxDataLength);
    });
}

function pageClick(e, goTo, maxDataLength) {
    "use strict";
    if (!((e.target.classList.contains('page-active')) || (e.target === this))) {

        var newIndex;

        if (e.target.getAttribute('data-page') === "first") {
            newIndex = 1;
        } else if (e.target.getAttribute('data-page') === "previous") {
            newIndex = this.querySelector('.page-active').getAttribute('data-page') - 1;
            if (newIndex < 1) return;

        } else if (e.target.getAttribute('data-page') === "next") {
            newIndex = this.querySelector('.page-active').getAttribute('data-page') - 1;
            newIndex += 2;
            if (newIndex > (maxDataLength / maxRows).toFixed(0)) return;
        } else if (e.target.getAttribute('data-page') === "last") {
            newIndex = (maxDataLength / maxRows).toFixed(0);
        } else {
            newIndex = e.target.getAttribute('data-page');
        }

        goTo(newIndex);
    }
}

function changePagerSelection(pager, index) {
    "use strict";
    //note this index doesn't exactly change selected page in the table, only used for
    Array.prototype.slice.call(pager.querySelectorAll('a'))
        .forEach(function (el) {
            el.classList.remove('page-active');
            var i = Array.prototype.indexOf.call(el.parentNode.children, el);
            if ((el.getAttribute('data-page') !== "first") && (el.getAttribute('data-page') !== "previous") && (el.getAttribute('data-page') !== "next") && (el.getAttribute('data-page') !== "last")) {
                el.hidden = !!((i < (index - 5)) || (i - 4 > index));
            }
        });
    var newPage = pager.querySelector('a[data-page="' + index.toString() + '"]');
    newPage.classList.add('page-active');
}