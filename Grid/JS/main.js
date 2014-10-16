fakeFactory=new DataFactory();
var numberArray=fakeFactory.getNumberArray();
var stringArray=fakeFactory.getStringArray();
var configObject=fakeFactory.getConfigObject();

var container=document.getElementById('placeForTables');

new SortableGrid(container,stringArray,configObject);
new SortableGrid(container,numberArray,configObject);