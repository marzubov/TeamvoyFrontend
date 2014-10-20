var container=document.getElementById('placeForTables');

var table=new SortableGrid(container,stringArray,configObject,maxRows).getCreatedElement();
table.border='1';

table =new SortableGrid(container,numberArray,configObject, maxRows).getCreatedElement();
table.border='3';
table.style.backgroundColor='lightgray';

table =new SortableGrid(container,numberArray,configObject, maxRows).getCreatedElement();
table.border='3';
table.style.backgroundColor='lightblue';

table =new SortableGrid(container,numberArray,configObject, maxRows).getCreatedElement();
table.border='3';
table.style.backgroundColor='white';