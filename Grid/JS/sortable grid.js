function SortableGrid(container, dataArray, config) {
    var element={};
    this.getCreatedElement=function(){return element;};
    init();



    function init(){
        createTable();
        container.appendChild(element);
    }
    function reInit(){

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
        // Make body
        var body='<tbody>';
        for(var i= 0;i<dataArray.length;i++){
            body+='<tr><td>'+dataArray[i].join('</td><td>')+'</td></tr>';
        }
        body+='</tbody>';
        element.innerHTML+=body;


        // Make header
        element.innerHTML+= '<thead><tr><td class="tableHeader">' + config.headers.join('</td><td class="tableHeader">') + '</td></thead>';
        var headCells=element.querySelectorAll('td.tableHeader');
        for(i=0;i<headCells.length;i++){
            headCells[i].onclick=headClicked;
        }





        // Places arrow in  head cell
        function headClicked() {
            var reverse;
            var text = this.innerHTML;
            if (text.lastIndexOf('↓') > -1) {
                this.innerHTML = text.replace(/↓/, '↑');
                reverse = true;
            }
            else if (text.lastIndexOf('↑') > -1) {
                this.innerHTML = text.replace(/↑/, '↓');
                reverse = false;
            }
            //Never sorted before
            else {
                deleteAllArrows();
                this.innerHTML += '↓';
                reverse = false;
            }
            sortArray(this.cellIndex, reverse);
        }
        // When another cell clicked
        function deleteAllArrows() {
            for (var i = 0; i < headCells.length; i++) {
                var string = headCells[i].innerHTML;
                string = string.replace(/↓/, '');
                headCells[i].innerHTML = string.replace(/↑/, '');
            }
        }
    }
}
