/**
 * Created by MU on 10/27/14.
 */
var Filterable = function (config, data, container, root){
    var that, generatedModel=[], changeFunctions, newData = [];

    this.init = function(){
        that = this;
        renderFormForFilter();
        render();
    };

    function renderFormForFilter() {
      var model = document.createDocumentFragment();
      var filterChooseField = document.createElement('select');
      filterChooseField.classList.add('field-choosing-column');
      for (var i = 0; i < config.headers.length; i++) {
        var option = document.createElement('option');
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
      container.insertBefore(model, container.firstChild);
    }

    function toggleSearchField() {
        var selectField = container.querySelector('.field-choosing-column');
        var columnIndex = selectField.selectedIndex;
        if (generatedModel[columnIndex].classList.contains('filterable-active')) {
          that.disableSearchField(columnIndex);
        } else {
          generatedModel.forEach(function (el, i) {
            if (i == columnIndex) { that.enableSearchField(columnIndex);
            } else {
              that.disableSearchField(i);
            }
          });

        }
    }

    function renderSearchField(){
        var filterField = document.createElement('input');
        filterField.classList.add('filterable');
        filterField.type = 'text';
        filterField.addEventListener('keyup', changeSearchField);
        //stopping click event on heading
        filterField.addEventListener('click', function(e){e.stopPropagation();});
        return filterField;
    }

    function render(){
        //adding your input element to the table headings
        Array.prototype.slice.call(root.rows[0].cells)
            .forEach(function (header) {
                generatedModel.push(renderSearchField());
                header.appendChild(generatedModel.slice(-1).pop());
            });
    }

    this.enableSearchField = function(index){
        var mykey, element, i = 0;
        //enabling
        generatedModel[index].classList.add('filterable-active');
        for (mykey in data[0]) {
          if (i == index) element = mykey;
          i++;
        }
      console.log(element);
        generatedModel[index].setAttribute("column-index", element);
    };

    this.disableSearchField = function(index){

        //disabling
        generatedModel[index].classList.remove('filterable-active');
    };

    function changeSearchField(e) {
      var searchField = e.target,
          informationFromSearch = searchField.value.toLowerCase(), key;
        newData = [];
        data.forEach(function (row, i) {
          if (filter(i, searchField.getAttribute('column-index'), informationFromSearch)) {
            newData.push(data[i])
          }
        });

        var configObj = {
          'headers': config.headers,
          'maxRows': config.maxRows,
          'arrayOrURL': newData,
          'withFilter': true,
          'changeData': true,
          'loadByParts': false,
          'columnTemplates': config.columnTemplates
        };
        var a = new SortableGrid(container, configObj);
        return newData;
    }

    function filter(row, cellIndex, information) {
        var text = (data[row][cellIndex]).toString().toLowerCase();
        var check = (text.indexOf(information) === -1) ? false : true;
        return check;
    }

    this.init();
};

