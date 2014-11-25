define(["draggable", "filterable", "pager"], function (Draggable, Filterable, Pager) {

  function SortableGrid(container, config) {
    this.container = container;
    this.config = config;
    this.dataObject;
    this.root = '';
    this.arrayCheck = [];
    this.arrayOfPositions = {};
    var pagesData = [], pagesDataObject = [], pageIndex = 1, countOfPages, pager, maxDataLength, sortedColumn, that, PagerObject, maxRows;
    var draggable;

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

    function renderRowsOfTable(from, to, dataObject) {
      var dataString = '';
      for (var i = from; i < to; i++) {
        dataString += "<tr>";
        for (var key in dataObject[i]) {
          if (dataObject[i].hasOwnProperty(key)){
            if (that.config.columnTemplates[key]) {
              dataString += '<td>' + replaceTemplate(that.config.columnTemplates[key], dataObject[i]) + '</td>';
            } else {
              dataString += '<td>' + dataObject[i][key] + '</td>';
            }
          }
        }
        dataString += "</tr>";
      }
      return dataString;
    }

    function replaceTemplate(template, dataObject) {
      for (var key in dataObject) {
        if (dataObject.hasOwnProperty(key)) {
          if (template.indexOf(key) != -1) {
            var newTemplate = template.replace("{{" + key + "}}", dataObject[key]);
          }
        }
      }
      return newTemplate;
    }

    function changePageData(fromPagesData) {
      var data, dataObject, dataBody = that.container.querySelector('.data-body'), dataString = '';
      if (!fromPagesData) {
        data = that.dataObject;
      } else {
        data = pagesData[pageIndex - 1];
        dataObject = pagesDataObject[pageIndex - 1];
      }
      if (!fromPagesData) {
        var rowLength = (pageIndex == countOfPages) ? data.length : pageIndex * maxRows;
        dataString = renderRowsOfTable((pageIndex - 1) * maxRows, rowLength, data);
      } else {
        var rowLength = (pageIndex == countOfPages) ? data.length : maxRows;
        dataString = renderRowsOfTable(0, rowLength, data);
      }
      dataBody.innerHTML = dataString;
      that.arrayCheck.forEach(function (el) {
        that.hideColumn(el);
      });
    }

    function sortTable(cellKey, reverse) {
      that.dataObject.sort(function(current, next) {
        if (typeof current[cellKey] == 'string') {
          var aName = current[cellKey].toLowerCase();
          var bName = next[cellKey].toLowerCase();
        } else {
          var aName = current[cellKey];
          var bName = next[cellKey];
        }
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
      });
      reverse === 'desc' ? that.dataObject.reverse() : 0;
      draggable.changeData(that.dataObject);
      changePageData(false);
      that.goTo(1);
    }

    this.goTo = function (newPageIndex) {
      if (!newPageIndex) {
        return;
      }
      if ((parseFloat(newPageIndex) < 0) || (parseFloat(newPageIndex) > (maxDataLength / maxRows + 1).toFixed(0))) {
        return;
      }
      pageIndex = newPageIndex;
      if (pager.childNodes.length) PagerObject.changePagerSelection(pager, pageIndex);
      if (that.dataObject.length == maxDataLength) {
        changePageData(false);
      } else {
        if (!pagesData[pageIndex - 1]) {
          if (that.dataObject.length != maxDataLength) {
            console.log("new request");
            getData(that.config.arrayOrURL, (pageIndex - 1) * maxRows, pageIndex * maxRows);
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

    function renderBody(data) {
      var bodyString = "";
      if (!maxRows || maxRows > data.length) {
        maxRows = data.length;
      }
      if (!maxDataLength) {
        maxDataLength = data.length;
      }
      bodyString += '<tbody class="data-body">';
      bodyString += renderRowsOfTable(0, maxRows, that.dataObject);
      bodyString += '</tbody>';
      return bodyString;
    }

    function headClicked(e) {
      var reverse;
      if (this.classList.contains('asc')) {
        this.classList.add('desc');
        this.classList.remove('asc');
        reverse = 'desc';
      } else if (this.classList.contains('desc')) {
        this.classList.add('asc');
        this.classList.remove('desc');
        reverse = 'asc';
      } else {
        reverse = 'asc';
        deleteArrows();
        this.classList.add('asc');
      }
      sortedColumn = this.cellIndex;
      var i = 0;
      for (key in that.arrayOfPositions) {
        if (i == sortedColumn) sortedColumn = key;
        i++;
      }
      console.log(sortedColumn);
      sortTable(sortedColumn, reverse);
    }

    function deleteArrows() {
      var headCells = that.container.querySelector('thead').querySelector('tr').querySelectorAll('td');
      if (sortedColumn !== undefined) {
        headCells[sortedColumn].classList.remove('desc');
        headCells[sortedColumn].classList.remove('asc');
      }
    }

    function renderTable(sortable, change) {
      if (change) {
        var bodyTable = that.container.querySelector(".data-body");
        bodyTable.innerHTML = renderBody(that.dataObject);
        that.arrayCheck.forEach(function (el) {
          that.hideColumn(el);
        });
      } else {
        var tableString = renderHeader();
        tableString += renderBody(that.dataObject);
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
      PagerObject = new Pager(pager, maxDataLength, that.goTo, maxRows);
    }

    function xhrOnLoad(xhr) {
      var receivedText = xhr.responseText.split("__obj__"),
        receivedObject = JSON.parse(receivedText[0]);
      console.log(receivedObject);
      maxDataLength = receivedText[1];
      that.dataObject = receivedObject;
      if (that.dataObject.length != maxDataLength) {
        pagesDataObject[pageIndex - 1] = that.dataObject;
      }
      if (!that.root.innerHTML) {
        countOfPages = (maxDataLength % maxRows) ?
          (maxDataLength / maxRows + 1).toFixed(0) :
          (maxDataLength / maxRows).toFixed(0);
        renderTable(false, false);
      } else {
        changePageData(true);
      }
      if (that.config.withHidden) {
        renderHiddenForm();
      }
      if (that.config.withFilter) {
        new Filterable(that);
      }
      if (that.config.withDraggable) draggable = new Draggable(that);

      return (xhr.responseText);
    }

    this.changeTableData = function (newData, newMaxRow) {
      pager = this.container.querySelector(".pages");
      that.dataObject = newData;
      draggable.changeData(that.dataObject);
      maxDataLength = that.dataObject.length;
      maxRows = newMaxRow;
      countOfPages = (maxDataLength % maxRows) ?
        (maxDataLength / maxRows + 1).toFixed(0) :
        (maxDataLength / maxRows).toFixed(0);
      renderTable(false, true);
    }

    function renderHiddenForm() {
      var allForm = document.createDocumentFragment();
      var openFormButton = document.createElement('button');
      openFormButton.innerHTML = "Open/Close form for hide columns";
      openFormButton.classList.add("check-form-button");
      openFormButton.addEventListener('click', toggleHiddenForm);
      allForm.appendChild(openFormButton);

      var wrapperForm = document.createElement("div");
      wrapperForm.classList.add('hidden-form', 'hidden-form-not-active');
      for (var i = 0; i < config.headers.length; i++) {
        var checkBox = document.createElement('input');
        checkBox.type = "checkbox";
        checkBox.value = i;
        checkBox.addEventListener("change", checkBoxEvent);
        checkBox.id = "field" + i;
        var label = document.createElement('label');
        label.htmlFor = "field" + i;
        label.appendChild(document.createTextNode(i + 1));
        wrapperForm.appendChild(checkBox);
        wrapperForm.appendChild(label);
      }
      allForm.appendChild(wrapperForm);
      container.insertBefore(allForm, container.firstChild);
    }

    function checkBoxEvent(e) {
      var columnIndex = e.target.value;
      toggleColumn(columnIndex);
    }

    function toggleColumn(columnIndex) {
      console.log(that.arrayCheck.indexOf(columnIndex));
      if (that.arrayCheck.indexOf(columnIndex) == -1) {
        that.hideColumn(columnIndex);
      } else {
        that.showColumn(columnIndex);
      }
      console.log(that.arrayCheck);
    }

    this.hideColumn = function (columnIndex) {
      var rowCount = that.root.rows.length;
      for (var i = 0; i < rowCount; i += 1) {
        that.root.rows[i].cells[columnIndex].classList.add("hidden-column");
        if (that.arrayCheck.indexOf(columnIndex) == -1) {
          that.arrayCheck.push(columnIndex);
        }
      }
    }

    this.showColumn = function (columnIndex) {
      var rowCount = that.root.rows.length;
      for (var i = 0; i < rowCount; i += 1) {
        that.root.rows[i].cells[columnIndex].classList.remove("hidden-column");
        if (that.arrayCheck.indexOf(columnIndex) != -1) {
          that.arrayCheck.splice(that.arrayCheck.indexOf(columnIndex), 1);
        }
      }
    }

    function toggleHiddenForm() {
      var form = container.querySelector('.hidden-form');
      if (form.classList.contains("hidden-form-not-active")) {
        form.classList.remove("hidden-form-not-active");
      } else {
        form.classList.add("hidden-form-not-active");
      }
    };

    function init() {
      this.root = document.createElement('table');
      pager = document.createElement('nav');
      pager.classList.add("pages");
      this.container.appendChild(this.root);
      this.container.appendChild(pager);
      that = this;
      maxRows = this.config.maxRows;

      for (var i = 0; i < that.config.headers.length; i++) {
        that.arrayOfPositions[that.config.headers[i].toLowerCase()] = i;
      }

      if (typeof this.config.arrayOrURL == 'string') {
        if (this.config.loadByParts) {
          getData(this.config.arrayOrURL, 0, maxRows);
        } else {
          getData(this.config.arrayOrURL);
        }
      } else {
          that.dataObject = this.config.arrayOrURL;
          maxDataLength = that.dataObject.length;
          countOfPages = (maxDataLength % maxRows) ?
            (maxDataLength / maxRows + 1).toFixed(0) :
            (maxDataLength / maxRows).toFixed(0);
        renderTable(false, false);
        if (that.config.withHidden) {
          renderHiddenForm();
        }
        if (that.config.withDraggable) {
          draggable = new Draggable(that);
        }
        if (that.config.withFilter) {
          new Filterable(that);
        }
      }
    }

    function createCORSRequest(method, url) {
      var xhr = new XMLHttpRequest();
      if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
      } else if (typeof XDomainRequest !== "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
      } else {
        // CORS not supported.
        xhr = null;
      }
      return xhr;
    }

    init.call(this);
    return this;
  };
  return SortableGrid;
});
