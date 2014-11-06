(function (global, document) {
    "use strict";
    global.SortableGrid = function SortableGrid(container, config) {
        var root, pager, maxDataLength, pagesData = [], sortedColumn, pageIndex = 1, that, PagerObject, filterable, object, dataArray=[];

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
                //removing table on error

                container.removeChild(root);
                container.removeChild(pager);
                alert('Woops, there was an error making the request.');
            };
            xhr.send();
        }

        function changePageData(fromPagesData) {
            var data, i, dataBody = container.querySelector('.data-body'), dataString = '', k = 0;
            if (!fromPagesData) {
                data = dataArray;
            } else {
                data = pagesData[pageIndex - 1];
            }
            if (!fromPagesData) {
                for (i = (pageIndex - 1) * config.maxRows; i < pageIndex * config.maxRows; i++) {
                    dataString += "<tr>";
                    if (config.columnTemplates) {
                        for (var j = 0; j < data[i].length; j++) {

                            if (config.columnTemplates[j]) {
                                dataString += '<td>' + config.columnTemplates[j](object[i]) + '</td>';
                                //console.log(dataArray[i][j].match(/<.+?>/g))
                                //console.log(dataArray[i][j].replace(/<\/?[^>]+(>|$)/g, ""));
                            } else {
                                dataString += '<td>' + data[i][j] + '</td>';
                            }

                        }
                    } else dataString += '<td>' + data[i].join('</td><td>') + '</td>';
                    dataString += "</tr>";
                }
            } else {
                for (i = 0; i < config.maxRows; i++) {
                    dataString += "<tr>";
                    if (config.columnTemplates) {
                    for (var j = 0; j < data[i].length; j++) {

                            if (config.columnTemplates[j]) {
                                dataString += '<td>' + config.columnTemplates[j](object[i]) + '</td>';
                                //console.log(dataArray[i][j].match(/<.+?>/g))
                                //console.log(dataArray[i][j].replace(/<\/?[^>]+(>|$)/g, ""));
                            } else {
                                dataString += '<td>' + data[i][j] + '</td>';
                            }

                    }
                    } else dataString += '<td>' + data[i].join('</td><td>') + '</td>';
                    dataString += "</tr>";
                }
            }
            dataBody.innerHTML = dataString;
        }

        function sortTable(cellIndex, reverse) {
            dataArray.sort(function (current, next) {

                if (parseFloat(current[cellIndex])) {
                    return current[cellIndex] - next[cellIndex];
                }
                return current[cellIndex] > next[cellIndex];
            });
            reverse === 'desc' ? dataArray.reverse() : 0;
            var keyIndex = 0;
            if (config.columnTemplates) {
              object.forEach(function (el) {
                var key, elementIndex = 0;
                for (key in el) {

                  el[key] = dataArray[keyIndex][elementIndex];
                  elementIndex += 1;
                }
                keyIndex += 1;
              });
            }
            //console.log(object);
            //console.log(dataArray);

            changePageData(false);
            that.goTo(1);
        }

        this.goTo = function (newPageIndex) {

            if (!newPageIndex) {
                return;
            }
            if ((parseFloat(newPageIndex) < 0) || (parseFloat(newPageIndex) > (maxDataLength / config.maxRows).toFixed(0))) {
                return;
            }
            pageIndex = newPageIndex;
            if (pager.childNodes.length) PagerObject.changePagerSelection(pager, pageIndex);
            if (dataArray.length === maxDataLength) {
                changePageData(false);
            } else {
                if (!pagesData[pageIndex - 1]) {
                    if (dataArray.length != maxDataLength) {
                        console.log("new request");
                        getData(config.arrayOrURL, (pageIndex - 1) * config.maxRows, pageIndex * config.maxRows);
                    } else {
                        changePageData(false);
                    }
                } else {
                    changePageData(true);
                }
            }

        };

        function renderHeader() {
          root.classList.add("table");
          root.classList.add("table-striped");
          root.classList.add("table-bordered");

          return '<thead><tr><td>' + config.headers.join('</td><td>') + '</td></thead>';

        }

        function renderBody(data){
          var bodyString="";
          if (config.columnTemplates) {
            bodyString += '<tbody class="data-body">';
            for (var i = 0; i < config.maxRows; i++) {
              bodyString += "<tr>";
              for (var j = 0; j < data[i].length; j++) {
                if (config.columnTemplates[j]) {
                  bodyString += '<td>' + config.columnTemplates[j](object[i]) + '</td>';

                } else {
                  bodyString += '<td>' + data[i][j] + '</td>';
                }
              }
              bodyString += "</tr>";
            }
          } else {
            bodyString += '<tbody class="data-body">';
            if (!config.maxRows || config.maxRows > data.length) {
              config.maxRows = data.length;
            }
            if (!maxDataLength) {
              maxDataLength = data.length;
            }
            for (var i = 0; i < config.maxRows; i++) {
              bodyString += '<tr><td>' + data[i].join('</td><td>') + '</td></tr>';
            }
          }
          bodyString += '</tbody>';
          return bodyString;
        }

        function renderTable(sortable) {
            if (config.changeData) {
              var bodyTable = container.querySelector(".data-body");
              bodyTable.innerHTML = renderBody(dataArray);


            } else {
              // Make headers
              var tableString = renderHeader();
              tableString += renderBody(dataArray);
              // Make body
              root.innerHTML = tableString;
            }
          var headCells = container.querySelector('thead').querySelector('tr').querySelectorAll('td');
          headCells = Array.prototype.slice.call(headCells);
          headCells.forEach(function (el) {
            el.classList.add('table-header');
            if (!sortable) {
              el.addEventListener('click', headClicked);
            }
          });

          // Places arrow in  head cell
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

          // When another cell clicked
          function deleteArrows() {
            // CAN BE ZERO THEN TRUE
            if (sortedColumn !== undefined) {
              headCells[sortedColumn].classList.remove('desc');
              headCells[sortedColumn].classList.remove('asc');
            }
          }

          PagerObject = new Pager(pager, maxDataLength, that.goTo, config.maxRows);
          if (dataArray.length == maxDataLength) {
            //draggable = new Draggable(root, dataArray);
            //filterable = new Filterable(root, dataArray);
          }
        }

        function xhrOnLoad(xhr) {
            var receivedText = xhr.responseText.split("__obj__"),
                receivedObject = JSON.parse(receivedText[0]),
                tempData = [];
            maxDataLength = receivedText[1];
            object = receivedObject;


            //tempData and tempArray for temporary storing data
            Array.prototype.slice.call(receivedObject)
                .forEach(function (el) {
                    var tempArray = [];
                    Object.keys(el).forEach(function (key, index) {
                        tempArray.push(el[key]);
                    });
                    tempData.push(tempArray);
                });
            dataArray = tempData;
            if (dataArray.length != maxDataLength) pagesData[pageIndex - 1] = tempData;
            if (!root.innerHTML) {
                if (maxDataLength == dataArray.length) {
                    renderTable(false);
                }
                else {
                    renderTable(true);
                }
            }
            else {
                changePageData(true);
            }
            if (config.withFilter) new Filterable(config, dataArray, container, root);
            return(xhr.responseText);
        }

        function init() {

          if (config.changeData) {
            pager = container.querySelector(".pages");
          } else {
            root = document.createElement('table');
          pager = document.createElement('nav');
          pager.classList.add("pages");
            container.appendChild(root);
            container.appendChild(pager);
        }

            that = this;
            if (typeof config.arrayOrURL == 'string') {
                //console.log('dataArray == null');
                if (config.loadByParts) {
                    getData(config.arrayOrURL, 0, config.maxRows);
                } else {
                    getData(config.arrayOrURL);
                }
            } else {
              dataArray = config.arrayOrURL;
              renderTable.call(this);
              if (config.withFilter) new Filterable(config, dataArray, container, root);
            }
        }

        this.getCreatedElement = function () {
            return this;
        };

        this.renderTable = function () {
            return renderTable();
        };

        this.getRoot = function () {
            return root
        };

        this.getData = function () {
            return dataArray;
        };

        this.sort = function () {
            sortTable();
        };

        init.call(this);
    };
})(window, document);
