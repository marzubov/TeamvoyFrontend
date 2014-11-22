(function (global, document) {
  global.SortableGrid = function SortableGrid(container, config) {
    this.container = container;
    this.config = config;
    this.dataArray = [];
    this.dataObject;
    this.root = '';
    this.arrayCheck = [];
    this.arrayOfPositions = [];
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

    function renderRowsOfTable(from, to, data, dataObject){
      var dataString = '';
      for (var i = from; i < to; i++) {
        dataString += "<tr>";
          for (var j = 0; j < data[i].length; j++) {
            if (that.config.columnTemplates[j]) {
              dataString += '<td>' + replaceTemplate(that.config.columnTemplates[j], dataObject[i]) + '</td>';
            } else {
              dataString += '<td>' + data[i][j] + '</td>';
            }
          }
        dataString += "</tr>";
      }
      return dataString;
    }

    function replaceTemplate (template, dataObject) {
      for (var key in dataObject){
        if (dataObject.hasOwnProperty(key)){
          if (template.indexOf(key) != -1) {var newTemplate = template.replace("{{" + key + "}}", dataObject[key]);}
        }
      }
      return newTemplate;
    }

    function changePageData(fromPagesData) {
      var data, dataObject, dataBody = that.container.querySelector('.data-body'), dataString = '';
      if (!fromPagesData) { data = that.dataArray; }
      else { data = pagesData[pageIndex - 1]; dataObject = pagesDataObject[pageIndex - 1]; }
      if (!fromPagesData) {
        var rowLength = (pageIndex == countOfPages) ? data.length : pageIndex * maxRows;
        dataString = renderRowsOfTable((pageIndex - 1) * maxRows, rowLength, data, that.dataObject);
      } else {
        var rowLength = (pageIndex == countOfPages) ? data.length : maxRows;
        dataString = renderRowsOfTable(0, rowLength, data, dataObject);
      }
      dataBody.innerHTML = dataString;
      that.arrayCheck.forEach(function(el){ that.hideColumn(el); });
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
      draggable.changeData(that.dataArray, that.dataObject);
      changePageData(false);
      that.goTo(1);
    }

    this.goTo = function (newPageIndex) {
      if (!newPageIndex) { return; }
      if ((parseFloat(newPageIndex) < 0) || (parseFloat(newPageIndex) > (maxDataLength / maxRows + 1).toFixed(0))) { return; }
      pageIndex = newPageIndex;
      if (pager.childNodes.length) PagerObject.changePagerSelection(pager, pageIndex);
      if (that.dataArray.length == maxDataLength) {
        changePageData(false);
      } else {
        if (!pagesData[pageIndex - 1]) {
          if (that.dataArray.length != maxDataLength) {
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

    function renderBody(data){
      var bodyString="";
      if (!maxRows || maxRows > data.length) {
        maxRows = data.length;
      }
      if (!maxDataLength) { maxDataLength = data.length; }
      bodyString += '<tbody class="data-body">';
      bodyString += renderRowsOfTable(0, maxRows, that.dataArray, that.dataObject);
      bodyString += '</tbody>';
      return bodyString;
    }

    function headClicked(e) {
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

    function renderTable(sortable, change) {
      if (change) {
        var bodyTable = that.container.querySelector(".data-body");
        bodyTable.innerHTML = renderBody(that.dataArray);
        that.arrayCheck.forEach(function(el){ that.hideColumn(el); });
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
      PagerObject = new Pager(pager, maxDataLength, that.goTo, maxRows);
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
      if (that.dataArray.length != maxDataLength) {
        pagesDataObject[pageIndex - 1] = that.dataObject;
        pagesData[pageIndex - 1] = that.dataArray;
      }
      if (!that.root.innerHTML) {
        countOfPages = (maxDataLength % maxRows) ?
          (maxDataLength / maxRows + 1).toFixed(0) :
          (maxDataLength / maxRows).toFixed(0);
        renderTable(false,false);
      } else {
        changePageData(true);
      }
      if (that.config.withHidden) { renderHiddenForm(); }
      if (that.config.withFilter) { new Filterable(that); }
      if (that.config.withDraggable) draggable = new Draggable(that);

      return(xhr.responseText);
    }

    this.changeTableData = function(newData, newMaxRow){
      pager = this.container.querySelector(".pages");
      if (newData[0] instanceof Array) {
        that.dataArray = newData;
      } else {
        that.dataArray = objToArray(newData);
        that.dataObject = newData;
        draggable.changeData(that.dataArray, that.dataObject);
        maxDataLength = that.dataArray.length;
      }
      maxRows = newMaxRow;
      countOfPages = (maxDataLength % maxRows) ?
        (maxDataLength / maxRows + 1).toFixed(0) :
        (maxDataLength / maxRows).toFixed(0);
      renderTable(false, true);
    }

    function renderHiddenForm (){
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
        label.appendChild(document.createTextNode(i+1));
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

    function toggleColumn(columnIndex){
      console.log(that.arrayCheck.indexOf(columnIndex));
          if (that.arrayCheck.indexOf(columnIndex) == -1) {
            that.hideColumn(columnIndex);
          } else {
            that.showColumn(columnIndex);
          }
      console.log(that.arrayCheck);
    }

    this.hideColumn = function(columnIndex) {
      var rowCount = that.root.rows.length;
      for (var i  = 0; i < rowCount; i += 1) {
        that.root.rows[i].cells[columnIndex].classList.add("hidden-column");
        if (that.arrayCheck.indexOf(columnIndex) == -1) {
          that.arrayCheck.push(columnIndex);
        }
      }
    }

    this.showColumn = function(columnIndex) {
      var rowCount = that.root.rows.length;
      for (var i  = 0; i < rowCount; i += 1) {
        that.root.rows[i].cells[columnIndex].classList.remove("hidden-column");
        if (that.arrayCheck.indexOf(columnIndex) != -1) {
          that.arrayCheck.splice(that.arrayCheck.indexOf(columnIndex), 1);
        }
      }
    }

    function toggleHiddenForm () {
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
      if (typeof this.config.arrayOrURL == 'string') {
        if (this.config.loadByParts) {
          getData(this.config.arrayOrURL, 0, maxRows);
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
        countOfPages = (maxDataLength % maxRows) ?
          (maxDataLength / maxRows + 1).toFixed(0) :
          (maxDataLength / maxRows).toFixed(0);
        renderTable(false, false);
        if (that.config.withHidden) { renderHiddenForm(); }
        if (that.config.withDraggable) { draggable = new Draggable(that); }
        if (that.config.withFilter) { new Filterable(that); }
      }
      for (var i = 0; i < that.config.headers.length; i++){
        that.arrayOfPositions.push(i);
      }
      console.log(that.arrayOfPositions);
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
})(window, document);
