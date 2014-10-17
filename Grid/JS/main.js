var numberArray=getNumberArray();
var stringArray=getStringArray();
var configObject=getConfig();

var container=document.getElementById('placeForTables');

var table=new SortableGrid(container,stringArray,configObject).getCreatedElement();
table.border='1';

table =new SortableGrid(container,numberArray,configObject).getCreatedElement();
table.border='3';
table.style.backgroundColor='lightgray';
