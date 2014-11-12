var Filterable = function (grid){
    var that, generatedModel=[], dataFromGrid, newData = [];

    this.init = function(){
        that = this;
        if (grid.dataObject) dataFromGrid = grid.dataObject;
        else dataFromGrid = grid.dataArray;
        renderFormForFilter();
        render();
    };

    function renderFormForFilter() {
      var model = document.createDocumentFragment();
      var filterChooseField = document.createElement('select');
      filterChooseField.classList.add('field-choosing-column');
      for (var i = 0; i < grid.config.headers.length; i++) {
        var option = document.createElement('option');
        option.setAttribute("data-column", i);
        option.innerHTML = i+1;
        filterChooseField.appendChild(option);
      }
      model.appendChild(filterChooseField);
      var chooseButton = document.createElement('input');
      chooseButton.classList.add("filter-button");
      chooseButton.type = 'button';
      chooseButton.value = "Add/Remove filter field";
      chooseButton.addEventListener("click", toggleSearchField);
      model.appendChild(chooseButton);
      grid.container.insertBefore(model, grid.container.firstChild);
    }

    function toggleSearchField() {
        var selectField = grid.container.querySelector('.field-choosing-column');
        var columnIndex = selectField.selectedIndex;
        var dataIndex = searchColumnIndex(columnIndex, selectField) - 1;
        if (generatedModel[columnIndex].classList.contains('filterable-active')) {
          that.disableSearchField(columnIndex);
        } else {
          generatedModel.forEach(function (el, i) {
            if (i == columnIndex) { that.enableSearchField(columnIndex,dataIndex);
            } else {
              that.disableSearchField(i);
            }
          });
        }
    }

    function searchColumnIndex(data, select) {
      var options = select.childNodes;
      for (var i = 0; i < options.length; i++) {
        if (options[i].getAttribute("data-column") == data) return options[i].text;
      }
      return false;
    }

    function renderSearchField(){
        var filterField = document.createElement('input');
        filterField.classList.add('filterable');
        filterField.type = 'text';
        filterField.addEventListener('keyup', changeSearchField);
        //stopping click event on heading
        filterField.addEventListener('click', function(e){ e.stopPropagation();});
        return filterField;
    }

    function render(){
        //adding your input element to the table headings
        Array.prototype.slice.call(grid.root.rows[0].cells)
            .forEach(function (header) {
                generatedModel.push(renderSearchField());
                header.appendChild(generatedModel.slice(-1).pop());
            });
    }

    this.enableSearchField = function(index, dataIndex){
        var mykey, element, i = 0;
        generatedModel[index].classList.add('filterable-active');
        for (mykey in dataFromGrid[0]) {
          if (i == dataIndex) element = mykey;
          i++;
        }
        generatedModel[index].setAttribute("column-index", element);
    };

    this.disableSearchField = function(index){
        generatedModel[index].classList.remove('filterable-active');
    };

    function changeSearchField(e) {
      var searchField = e.target,
          informationFromSearch = searchField.value.toLowerCase(), key;
        newData = [];
        dataFromGrid.forEach(function (row, i) {
          if (filter(i, searchField.getAttribute('column-index'), informationFromSearch)) {
            newData.push(dataFromGrid[i])
          }
        });
      console.log(grid.config.maxRows);
        grid.changeTableData(newData, grid.config.maxRows);
        return newData;
    }

    function filter(row, cellIndex, information) {
        var text = (dataFromGrid[row][cellIndex]).toString().toLowerCase();
        var check = (text.indexOf(information) === -1) ? false : true;
        return check;
    }

    this.init();
};
