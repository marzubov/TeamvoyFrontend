(function (global, document) {
    "use strict";
    global.SortableGrid = function SortableGrid(container, dataArray, config, maxRows) {
        var root, pager, maxDataLength, pagesData = [], sortedColumn, pageIndex = 1, that, draggable, filterable;

        function getData(url, start, end) {
            url += '/getdata';
            if (start || end) {
                url += '_' + start + '_' + end;
            }
            console.log(url);
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
            var data, i, dataBody = root.querySelector('.data-body'), dataString = '';
            if (!fromPagesData) {
                data = dataArray;
            } else {
                data = pagesData[pageIndex - 1];
            }
            if (!fromPagesData) {
                for (i = (pageIndex - 1) * maxRows; i < pageIndex * maxRows; i++) {
                    dataString += '<tr><td>' + data[i].join('</td><td>') + '</td></tr>';
                }
            } else {
                for (i = 0; i < maxRows; i++) {
                    dataString += '<tr><td>' + data[i].join('</td><td>') + '</td></tr>';
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
            changePageData(false);
            that.goTo(1);
        }

        this.goTo = function (newPageIndex) {

            if (!newPageIndex) {
                return;
            }
            if ((parseFloat(newPageIndex) < 0) || (parseFloat(newPageIndex) > (maxDataLength / maxRows).toFixed(0))) {
                return;
            }
            pageIndex = newPageIndex;
            if (pager.childNodes.length) changePagerSelection(pager, pageIndex);
            if (dataArray.length === maxDataLength) {
                changePageData(false);
            } else {
                if (!pagesData[pageIndex - 1]) {
                    if (dataArray.length != maxDataLength) {
                        console.log("new request");
                        getData(config.url, (pageIndex - 1) * maxRows, pageIndex * maxRows);
                    } else {
                        changePageData(false);
                    }
                } else {
                    changePageData(true);
                }
            }

        };

        function renderTable(sortable) {
            // Make headers

            root.classList.add("table");
            root.classList.add("table-striped");
            root.classList.add("table-bordered");

            var tableString = '<thead><tr><td>' + config.headers.join('</td><td>') + '</td></thead>';
            // Make body
            tableString += '<tbody class="data-body ">';
            if (!maxRows) {
                maxRows = dataArray.length;
            }
            if (!maxDataLength) {
                maxDataLength = dataArray.length;
            }
            for (var i = 0; i < maxRows; i++) {
                tableString += '<tr><td>' + dataArray[i].join('</td><td>') + '</td></tr>';
            }
            tableString += '</tbody>';
            root.innerHTML = tableString;

            var headCells = root.querySelector('thead').querySelector('tr').querySelectorAll('td');
            headCells = Array.prototype.slice.call(headCells);
            headCells.forEach(function (el) {
                el.className += ' table-header';
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

            new RenderPager(pager, maxDataLength, that.goTo);
            if (dataArray.length == maxDataLength) {
                draggable = new Draggable(root, dataArray, that);
            }
        }

        function xhrOnLoad(xhr) {
            var receivedText = xhr.responseText.split('__objectmaxlength__'),
                receivedObject = JSON.parse(receivedText[0]),
                tempData = [];
            maxDataLength = receivedText[1];
            console.log("response object ", receivedObject);
            console.log("response object max length", receivedText[1]);

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
            //alert('Response from CORS request to' + url + ': ' + xhr.responseText);

            return(xhr.responseText);
        }

        function init() {
            root = document.createElement('table');
            pager = document.createElement('nav');
            container.appendChild(root);
            container.appendChild(pager);
            that = this;

            if (dataArray === null) {
                console.log('dataArray == null');
                if (config.loadByParts) {
                    getData(config.url, 0, maxRows);
                } else {
                    getData(config.url);
                }
            } else {
                renderTable.call(this);
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

        this.deleteAllArrows = function () {
            var headCells = Array.prototype.slice.call(root.rows[0].cells);
            headCells.forEach(function (el) {
                el.classList.remove('desc');
                el.classList.remove('asc');
            });
        };

        this.sort = function () {
            sortTable();
        };

        this.refresh = function (newDataArray, newConfig, newMaxRows) {
            if (newDataArray) {
                dataArray = newDataArray;
            }
            if (newConfig) {
                config = newConfig;
            }
            if (newMaxRows) {
                maxRows = newMaxRows;
            }

            pager.innerHTML = "";
            pager.className = "";
            root.innerHTML = "";
            pager.innerHTML = "";
            if (dataArray.length == maxDataLength) renderTable(false);
            else renderTable(true);
            that.goTo(1);
        };

        init.call(this);
    };
})(window, document);