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
        reverse?dataArray.reverse():0;
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
            if(this.className.search('table-header active inc') != -1){
                this.className= this.className.replace(/table-header active inc/,'table-header active dec');
                reverse=true;
            }
            else if(this.className.search('table-header active dec') != -1){
                this.className= this.className.replace(/table-header active dec/,'table-header active inc');
                reverse=false;
            }
            // Sort new column
            else{
                deleteArrows();
                this.className= this.className.replace(/table-header/,'table-header active inc');
            }

            sortArray(this.cellIndex, reverse);
        }

        // When another cell clicked
       function deleteArrows() {
           var cell=headCells.filter(function(el){
              return el.className.search('table-header active')!=-1});
           if(cell.length>0) {
               cell[0].className = cell[0].className.replace(/table-header active inc/, 'table-header');
               cell[0].className = cell[0].className.replace(/table-header active dec/, 'table-header');
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