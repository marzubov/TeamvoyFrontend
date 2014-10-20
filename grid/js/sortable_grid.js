function SortableGrid(container, dataArray, config, maxRows) {
    var element = {};
    var pages = {};
    this.getCreatedElement=function(){return element;};
    var sortedColumn;
    var pageIndex;
    init();

    function init(){
        createTable();
        container.appendChild(element);
        container.appendChild(pages);
        if (pages.children[0].children[0].children.length == 1){
            pages.hidden = true;
        }
    }

    function reInit(){
        changeData(pageIndex);
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
        reInit();
    }

    function createTable(){
        element=document.createElement('table');

        // Make headers
        var tableString = '<thead><tr><td>' + config.headers.join('</td><td>') + '</td></thead>';
        // Make body
        tableString +='<tbody class="data-body">';
        if(!maxRows) maxRows = dataArray.length;
        for (var i=0;i<maxRows;i++)tableString += '<tr><td>' + dataArray[i].join('</td><td>') + '</td></tr>';

        tableString+='</tbody>';

        //Make pages
        pages = document.createElement('table');
        var pagesString = '<tbody><tr>';
        for (var i = 1; i <= (dataArray.length/maxRows).toFixed(0); i++) pagesString += '<td>' + i + '</td>';;

        element.innerHTML+=tableString;
        pages.innerHTML+=pagesString + '</tbody>';
        pageIndex = 1;
        var headCells=element.querySelector('thead').querySelector('tr').querySelectorAll('td');
        headCells=Array.prototype.slice.call(headCells);
        headCells.forEach(function(el){
            el.className+=' table-header';
            el.addEventListener('click',headClicked);
        });

        Array.prototype.slice.call(pages.querySelectorAll('td'))
            .forEach(function(el){

                el.className = 'page';

                if (el.innerHTML == '1') {
                    el.className = 'page-active';
                }
                var i = Array.prototype.indexOf.call(el.parentNode.children, el);
                el.hidden = !!((i < (1 - 5)) || (i - 4 > 1));

                el.addEventListener('click',function(){
                    var newPageIndex = this.innerHTML;
                    Array.prototype.slice.call(this.parentNode.parentNode.querySelectorAll('td'))
                        .forEach(function(el){
                            el.className = 'page';
                            var i = Array.prototype.indexOf.call(el.parentNode.children, el);
                            el.hidden = !!((i < (newPageIndex - 4)) || (i - 3 > newPageIndex));
                        });
                    changeData(newPageIndex);
                    this.className = 'page-active';
                });
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
    function changeData(newPageIndex){
        pageIndex=newPageIndex;
        var data= element.querySelector('.data-body');
        var dataString='';
        var maxRowIndex=maxRows+(pageIndex-1)*maxRows;
        if (maxRows+(pageIndex-1)*maxRows > dataArray.length) maxRowIndex = dataArray.length;
        for (var i=0 + (pageIndex-1)*maxRows;i<maxRowIndex;i++){
            dataString+='<tr><td>'+dataArray[i].join('</td><td>')+'</td></tr>';
        }
        data.innerHTML=dataString;
    }
}