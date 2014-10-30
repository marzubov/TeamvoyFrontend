var container = document.getElementById('draggable');
var draggableTable, filteredTable, fullDataTable, partDataTable;

draggableTable = new SortableGrid(container, numberArray, configObject, maxRows).getCreatedElement();

var draggable = new Draggable(draggableTable.getRoot(), draggableTable.getData());

container = document.getElementById('filterable');
filteredTable = new SortableGrid(container, stringArray, configObject, maxRows).getCreatedElement();
var filterable = new Filterable(filteredTable.getRoot());
filterable.enable(1);

container = document.getElementById('fullServerData');
fullDataTable = new SortableGrid(container, null, configObjectFullLoading, maxRows).getCreatedElement();

container = document.getElementById('withTemplate');
fullDataTable = new SortableGrid(container, null, configObjectFullLoadingWithTemplate, maxRows).getCreatedElement();

container = document.getElementById('partialServerData');
partDataTable = new SortableGrid(container, null, configObjectPartialLoading, maxRows).getCreatedElement();