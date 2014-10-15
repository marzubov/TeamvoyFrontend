function SortableGrid(table) {
    if(table){
        makeSortable(table);
    }
    else{
        table = document.createElement('table');
    }
    table.makeSortable = function(){
        makeSortable(table);
    }
        table.sort = function (cellIndex, reverse) {
            sortTable(reverse, cellIndex, this);
        };
    return table;


    //private methods

    function makeSortable(table){
        var cells;
        var thead = table.getElementsByTagName('thead')[0];
        //  Table have 'thead' tag
        if (thead) {
            cells = thead.getElementsByTagName('td');
        }
        // Table have 'th' tags
        else {
            cells = table.getElementsByTagName('th');
        }
        for (var j = 0; j < cells.length; j++) {
            cells[j].className += (' tableHeader');
            cells[j].onclick = headClicked;
        }
    }

    // Places arrow in  head cell
    function headClicked(cellIndex) {
        var reverse;
        var table=this;
        while(table.localName!='table'){
            table=table.parentNode;
        }
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
            deleteAllArrows(table);
            this.innerHTML += '↓';
            reverse = false;
        }
        sortTable(reverse, this.cellIndex,table);
    }
    // When another cell clicked
    function deleteAllArrows(table) {
        var elements = table.getElementsByClassName('tableHeader');
        for (var i = 0; i < elements.length; i++) {
            var string = elements[i].innerHTML;
            string = string.replace(/↓/, '');
            elements[i].innerHTML = string.replace(/↑/, '');
        }
    }

    function sortTable(reverse, cellIndex, table) {
        var store = [];
        var tbody=table.getElementsByTagName('tbody')[0];
        var startsWith;
        // If there is no thead tag in table dont sort 1 row
        table.getElementsByTagName('thead')[0] ? startsWith=0:startsWith=1;

        for (var i = startsWith; i < tbody.rows.length; i++) {
            var row = tbody.rows[i];
            var sortString = row.cells[cellIndex].textContent;
            store.push([sortString, row]);
        }
        // if cell has number
        parseFloat(store[0][0]) ?
        store.sort(function(a,b){return a[0]-b[0];}) :
        store.sort();
        if (reverse) {
            store.reverse();
        }
        for ( i = 0; i < store.length; i++) {
            tbody.appendChild(store[i][1]);
        }
    }
}
