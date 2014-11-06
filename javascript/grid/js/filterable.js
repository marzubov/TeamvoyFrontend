/**
 * Created by MU on 10/27/14.
 */
var Filterable = function (container, table){
    var that, generatedModel=[], changeFunctions;

    this.init = function(){
        //init
        that = this;
        generateFormForChooseFilter();
        render();
    };

    function generateFormForChooseFilter() {
      var model = document.createDocumentFragment();
      var filterChooseField = document.createElement('select');
      filterChooseField.classList.add('field-choosing-column');
      for (var i = 0; i < table.rows[0].cells.length; i++) {
        var option = document.createElement('option');
        option.innerHTML = i;
        filterChooseField.appendChild(option);
      }
      model.appendChild(filterChooseField);
      var chooseButton = document.createElement('input');
      chooseButton.classList.add("filter-button");
      chooseButton.type = 'button';
      chooseButton.value = "Add filter field";
      chooseButton.addEventListener("click", toggleSearchField);
      model.appendChild(chooseButton);
      container.insertBefore(model, container.firstChild);
    }

    function toggleSearchField() {
        var selectField = document.querySelector('.field-choosing-column');
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

    function generateElement(index){
        var filterField = document.createElement('input');
        filterField.classList.add('filterable');
        filterField.type = 'text';
        filterField.addEventListener('keyup', onChange);
        //stopping click event on heading
        filterField.addEventListener('click', function(e){e.stopPropagation();});
        return filterField;
    }

    function render(){
        var index = 0;
        //adding your input element to the table headings
      table.classList.add("filterable-table");
        Array.prototype.slice.call(table.rows[0].cells)
            .forEach(function (header) {
                generatedModel.push(generateElement(index++));
                header.appendChild(generatedModel.slice(-1).pop());
            });
    }

    this.enableSearchField = function(index){

        //enabling
        generatedModel[index].classList.add('filterable-active');
        generatedModel[index].setAttribute("column-index", index);
    };

    this.disableSearchField = function(index){

        //disabling
        generatedModel[index].classList.remove('filterable-active');
    };

    function onChange(e) {
      var searchField = e.target,
          informationFromSearch = searchField.value.toLowerCase(),
          index = 0;
      Array.prototype.slice.call(table.rows)
        .forEach(function (row) {
          if (index == 0) {index++; return false;}

          filter(row, searchField.getAttribute('column-index'), informationFromSearch);
        });
        return this.value;
    }

    function filter(row, cellIndex, information) {
        var text = row.cells[cellIndex].textContent.toLowerCase();
        row.style.display = text.indexOf(information) === -1 ? 'none' : 'table-row';
    }

    this.init();
};
Filterable.prototype = new EventMachine();
