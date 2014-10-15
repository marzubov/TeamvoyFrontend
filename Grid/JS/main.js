function entryPoint(){
    var a = document.getElementsByTagName('table');
    var tableArray=[];
    //for test
    var table;
    for(var i=0;i< a.length;i++)
         table=new SortableGrid(a[i]);

    table.style.backgroundColor = 'darkgray';
}