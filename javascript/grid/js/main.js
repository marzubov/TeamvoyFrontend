var container = document.getElementById('placeForTables');
var text = document.createElement('h4');
var table;

text.innerHTML = 'Table with data from simple array';
container.appendChild(text);
table = new SortableGrid(container, stringArray, configObject, maxRows).getCreatedElement();

text = document.createElement('h4');
text.innerHTML = 'Table with data from array with randomly generated numbers';
container.appendChild(text);
table = new SortableGrid(container, numberArray, configObject, maxRows).getCreatedElement();

text = document.createElement('h4');
text.innerHTML = 'Table with data from server json file';
container.appendChild(text);
text = document.createElement('p');
text.innerHTML = 'Loading full data from server\'s .json file, so sorting is available '
container.appendChild(text);
table = new SortableGrid(container, null, configObjectFullLoading, maxRows).getCreatedElement();

text = document.createElement('h4');
text.innerHTML = 'Table with data from server json file';
container.appendChild(text);
text = document.createElement('p');
text.innerHTML = 'Loading part of data from server\'s .json file, so sorting is not available'
container.appendChild(text);
table = new SortableGrid(container, null, configObjectPartialLoading, maxRows).getCreatedElement();