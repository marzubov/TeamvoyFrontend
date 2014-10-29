var container = document.getElementById('draggable');
var draggableTable, filteredTable, fullDataTable, partDataTable;

draggableTable = new SortableGrid(container, numberArray, configObject, maxRows).getCreatedElement();

var draggable = new Draggable(draggableTable.getRoot(), draggableTable.getData());

container = document.getElementById('filterable');
filteredTable = new SortableGrid(container, stringArray, configObject, maxRows).getCreatedElement();
var filterable = new Filterable(filteredTable.getRoot());
filterable.enable(1);
//filteredTable.getRoot().rows[0].cells[1].addEventListener('dblclick', function(){filterable.enable(1)});
filterable.on('change myevent event', function(){console.log('1');});
filterable.on('change', function(){console.log('2');});
filterable.on('change', function(){console.log('3');});
filterable.on('change', filteredTable.filter);
filterable.off('change', filteredTable.filter);
filterable.off('change event', function(){console.log('1');});
filterable.on('event', function(){console.log('33333');});
filterable.trigger('change event');

container = document.getElementById('fullServerData');
fullDataTable = new SortableGrid(container, null, configObjectFullLoading, maxRows).getCreatedElement();

container = document.getElementById('withTemplate');
fullDataTable = new SortableGrid(container, null, configObjectFullLoadingWithTemplate, maxRows).getCreatedElement();

//container = document.getElementById('partialServerData');
//partDataTable = new SortableGrid(container, null, configObjectPartialLoading, maxRows).getCreatedElement();