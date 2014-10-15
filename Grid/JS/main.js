function entryPoint(){
    var a = document.getElementsByTagName('table');
    new SortableGrid(a[0]);


    //for test
    var table= new SortableGrid();
    table.style.backgroundColor = 'darkgray';
    table.border = '1';
    var headRow=document.createElement('tr');
    var tbody = document.createElement('tbody');
    for(var i=0;i<5;i++) {
        var th = document.createElement('th');
        th.innerHTML = i;
        headRow.appendChild(th);
        tbody.appendChild(headRow);
    }
        for(var j=0;j<7;j++){
            var row=document.createElement('tr');
            for(var c=0;c<5;c++){
                var td = document.createElement('td');
                td.innerHTML=Math.floor(Math.random() * 100);
                row.appendChild(td);
            }
            tbody.appendChild(row);
        }
    table.appendChild(tbody);
    document.getElementsByTagName('body')[0].appendChild(table);
    table.makeSortable();
}