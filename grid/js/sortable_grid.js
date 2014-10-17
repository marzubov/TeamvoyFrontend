function SortableGrid(container, dataArray, config) {
    var element={};
    this.getCreatedElement=function(){return element;};
    var sortedColumn;
    init();
    function init(){
        createTable();
        container.appendChild(element);
    }
    function reInit(){
        changeData();
    }

    //private methods
    function sortArray(cellIndex,reverse){
        dataArray.sort(function(current,next){

            if(parseFloat(current[cellIndex]))
                return current[cellIndex] - next[cellIndex];
            else
                return current[cellIndex]>next[cellIndex];
        });
        reverse=='desc'?dataArray.reverse():0;
        // reDraw element
        reInit();
    }

    function createTable(){
        element=document.createElement('table');

        // Make header
        var tableString = '<thead><tr><td>' + config.headers.join('</td><td>') + '</td></thead>';
        // Make body
        tableString +='<tbody class="data-body">';
        dataArray.forEach(function(el){tableString+='<tr><td>'+el.join('</td><td>')+'</td></tr>';});
        tableString+='</tbody>';
        element.innerHTML+=tableString;

        var headCells=element.querySelector('thead').querySelector('tr').querySelectorAll('td');
        headCells=Array.prototype.slice.call(headCells);
        headCells.forEach(function(el){
            el.className+=' table-header';
            el.addEventListener('click',headClicked);
        });

        // Places arrow in  head cell
        function headClicked() {

            var reverse;
            if(this.classList.contains('asc')){
                this.classList.add('desc');
                this.classList.remove('asc');
                reverse='desc';
            }
            else if(this.classList.contains('desc')){
                this.classList.add('asc');
                this.classList.remove('desc');
                reverse='asc';
            }
            // Sort new column
            else{
                reverse='asc';
                deleteArrows();
                this.classList.add('asc');
            }
            sortedColumn=this.cellIndex;
            sortArray(sortedColumn, reverse);
        }

        // When another cell clicked
       function deleteArrows() {
           // CAN BE ZERO THEN TRUE
           if(sortedColumn != undefined) {
               headCells[sortedColumn].classList.remove('desc');
               headCells[sortedColumn].classList.remove('asc');
           }
       }
    }

    // after sorting
    function changeData(){
       var data= element.querySelector('.data-body');
       var dataString='';
       dataArray.forEach(function(el){dataString+='<tr><td>'+el.join('</td><td>')+'</td></tr>';});
       data.innerHTML=dataString;
    }
}