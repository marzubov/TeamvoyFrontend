/**
 * Created by MU on 10/27/14.
 */
var Filterable = function (table){
    var that, generatedModel=[], changeFunctions;

    this.init = function(){

        //init
        that = this;
        render();
    };

    function generateElement(){
        var model = document.createElement('input');
        model.classList.add('filterable');
        model.type = 'text';
        model.addEventListener('keyup', onChange);

        //stopping click event on heading
        model.addEventListener('click', function(e){e.stopPropagation();});
        return model;
    }

    function render(){

        //adding your input element to the table headings
        Array.prototype.slice.call(table.rows[0].cells)
            .forEach(function (header) {
                generatedModel.push(generateElement());
                header.appendChild(generatedModel.slice(-1).pop());
            });
    }

    this.enable = function(index){

        //enabling
        generatedModel[index].classList.add('filterable-active');
    };

    this.disable = function(index){

        //disabling
        generatedModel[index].classList.remove('filterable-active');
    };

    function onChange(e) {

        //that.eventMachineFunctions.change[0](e);
        Array.prototype.slice.call(that.funcArray.change)
            .forEach(function (eventHandler) {
                eventHandler(e);
            });
        return this.value;
    }

    function filter(row) {
        var text = row.textContent.toLowerCase(), val = input.value.toLowerCase();
        row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
    }

    // function bindEvents(){
    // 	//binding events
    // }

    this.init();
};
Filterable.prototype = new EventMachine();
