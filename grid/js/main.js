var container=document.getElementById('placeForTables');

// var table=new SortableGrid(container,stringArray,configObject).getCreatedElement();
// table.border='1';

table =new SortableGrid(container,numberArray,configObject, maxRows).getCreatedElement();
table.border='3';
table.style.backgroundColor='lightgray';