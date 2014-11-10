(function (global, document) {
    global.SortableGrid = function SortableGrid(container, config) {
        this.container = container;
        this.config = config;
        this.dataArray = [];
        this.dataObject;
        this.root = '';
        var pagesData = [], pageIndex = 1, countOfPages, pager, maxDataLength, sortedColumn, that, PagerObject;

        function getData(url, start, end) {
            url += '/getdata';
            if (start || end) {
                url += '_' + start + '_' + end;
            }
            var xhr = createCORSRequest('GET', url);
            if (!xhr) {
                alert('CORS not supported');
                return;
            }
            // Response handlers.
            xhr.onload = function () {
                xhrOnLoad(xhr);
            };
            xhr.onerror = function () {
                that.container.removeChild(that.root);
                that.container.removeChild(pager);
                alert('Woops, there was an error making the request.');
            };
            xhr.send();
        }

        function renderRowsOfTable(from, to, data){
          var dataString = '';
          for (var i = from; i < to; i++) {
            dataString += "<tr>";
            if (that.config.columnTemplates) {
              for (var j = 0; j < data[i].length; j++) {
                if (that.config.columnTemplates[j]) {
                  dataString += '<td>' + that.config.columnTemplates[j](that.dataObject[i]) + '</td>';
                } else {
                  dataString += '<td>' + data[i][j] + '</td>';
                }
              }
            } else dataString += '<td>' + data[i].join('</td><td>') + '</td>';
            dataString += "</tr>";
          }
          return dataString;
        }

        function changePageData(fromPagesData) {
            var data, dataBody = that.container.querySelector('.data-body'), dataString = '';
            if (!fromPagesData) { data = that.dataArray; }
            else { data = pagesData[pageIndex - 1]; }
            if (!fromPagesData) {
                if (pageIndex == countOfPages) {
                  dataString = renderRowsOfTable((pageIndex - 1) * that.config.maxRows, data.length, data);
                } else {
                  dataString = renderRowsOfTable((pageIndex - 1) * that.config.maxRows, pageIndex * that.config.maxRows, data);
                }
            } else {
                dataString = renderRowsOfTable(0, that.config.maxRows, data);
            }
            dataBody.innerHTML = dataString;
        }

        function sortTable(cellIndex, reverse) {
            that.dataArray.sort(function (current, next) {
                if (parseFloat(current[cellIndex])) {
                    return current[cellIndex] - next[cellIndex];
                }
                return current[cellIndex] > next[cellIndex];
            });
            reverse === 'desc' ? that.dataArray.reverse() : 0;
            var keyIndex = 0;
            if (that.config.columnTemplates) {
              that.dataObject.forEach(function (el) {
                var key, elementIndex = 0;
                for (key in el) {
                  if (el.hasOwnProperty(key)) {
                    el[key] = that.dataArray[keyIndex][elementIndex];
                    elementIndex += 1;
                  }
                }
                keyIndex += 1;
              });
            }
            changePageData(false);
            that.goTo(1);
        }

        this.goTo = function (newPageIndex) {
            if (!newPageIndex) { return; }
            if ((parseFloat(newPageIndex) < 0) || (parseFloat(newPageIndex) > (maxDataLength / that.config.maxRows + 1).toFixed(0))) { return; }
            pageIndex = newPageIndex;
            if (pager.childNodes.length) PagerObject.changePagerSelection(pager, pageIndex);
            if (that.dataArray.length === maxDataLength) {
                changePageData(false);
            } else {
                if (!pagesData[pageIndex - 1]) {
                    if (that.dataArray.length != maxDataLength) {
                        console.log("new request");
                        getData(that.config.arrayOrURL, (pageIndex - 1) * that.config.maxRows, pageIndex * that.config.maxRows);
                    } else {
                        changePageData(false);
                    }
                } else {
                    changePageData(true);
                }
            }
        };

        function renderHeader() {
          that.root.classList.add("table");
          that.root.classList.add("table-striped");
          that.root.classList.add("table-bordered");
          return '<thead><tr><td>' + that.config.headers.join('</td><td>') + '</td></thead>';
        }

        function renderBody(data){
          var bodyString="";
          if (!that.config.maxRows || that.config.maxRows > data.length) {
            that.config.maxRows = data.length;
          }
          if (!maxDataLength) { maxDataLength = data.length; }
          bodyString += '<tbody class="data-body">';
          bodyString += renderRowsOfTable(0, that.config.maxRows, that.dataArray);
          bodyString += '</tbody>';
          return bodyString;
        }

        function headClicked() {
          var reverse;
          if (this.classList.contains('asc')) {
            this.classList.add('desc');
            this.classList.remove('asc');
            reverse = 'desc';
          }
          else if (this.classList.contains('desc')) {
            this.classList.add('asc');
            this.classList.remove('desc');
            reverse = 'asc';
          }
          // Sort new column
          else {
            reverse = 'asc';
            deleteArrows();
            this.classList.add('asc');
          }
          sortedColumn = this.cellIndex;
          sortTable(sortedColumn, reverse);
        }

        function deleteArrows() {
          // CAN BE ZERO THEN TRUE
          var headCells = that.container.querySelector('thead').querySelector('tr').querySelectorAll('td');
          if (sortedColumn !== undefined) {
            headCells[sortedColumn].classList.remove('desc');
            headCells[sortedColumn].classList.remove('asc');
          }
        }

        function renderTable(sortable) {
          countOfPages = (maxDataLength % that.config.maxRows) ?
            (maxDataLength / that.config.maxRows + 1).toFixed(0) :
            (maxDataLength / that.config.maxRows).toFixed(0);
            if (that.config.changeData) {
              var bodyTable = that.container.querySelector(".data-body");
              bodyTable.innerHTML = renderBody(that.dataArray);
            } else {
              var tableString = renderHeader();
              tableString += renderBody(that.dataArray);
              that.root.innerHTML = tableString;
            }
          var headCells = that.container.querySelector('thead').querySelector('tr').querySelectorAll('td');
          headCells = Array.prototype.slice.call(headCells);
          headCells.forEach(function (el) {
            el.classList.add('table-header');
            if (!sortable) {
              el.addEventListener('click', headClicked);
            }
          });
          PagerObject = new Pager(pager, maxDataLength, that.goTo, that.config.maxRows);
        }

        function objToArray(object){
          var tempData = [];
          Array.prototype.slice.call(object)
            .forEach(function (el) {
              var tempArray = [];
              Object.keys(el).forEach(function (key, index) {
                tempArray.push(el[key]);
              });
              tempData.push(tempArray);
            });
          return tempData;
        }

        function xhrOnLoad(xhr) {
            var receivedText = xhr.responseText.split("__obj__"),
                receivedObject = JSON.parse(receivedText[0]);
            maxDataLength = receivedText[1];
            that.dataObject = receivedObject;
            that.dataArray = objToArray(receivedObject);
            if (that.dataArray.length != maxDataLength) pagesData[pageIndex - 1] = that.dataArray;
            if (!that.root.innerHTML) {
                renderTable(false);
            } else {
                changePageData(true);
            }
            if (that.config.withFilter) new Filterable(that);
            return(xhr.responseText);
        }

        function init() {
          if (this.config.changeData) {
            pager = this.container.querySelector(".pages");
          } else {
            this.root = document.createElement('table');
          pager = document.createElement('nav');
          pager.classList.add("pages");
            this.container.appendChild(this.root);
            this.container.appendChild(pager);
          }
            that = this;
            if (typeof this.config.arrayOrURL == 'string') {
                if (this.config.loadByParts) {
                    getData(this.config.arrayOrURL, 0, this.config.maxRows);
                } else {
                    getData(this.config.arrayOrURL);
                }
            } else {
              if (this.config instanceof Array) {
                that.dataArray = this.config.arrayOrURL;
              } else {
                that.dataArray = objToArray(this.config.arrayOrURL);
                that.dataObject = this.config.arrayOrURL;
                maxDataLength = that.dataArray.length;
              }
              renderTable(false);
              if (!that.config.changeData && that.config.withFilter) new Filterable(that);
            }
        }

       init.call(this);
       return this;
    };
})(window, document);
