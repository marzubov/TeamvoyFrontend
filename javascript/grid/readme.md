##SortableGrid.js

Component Table is created without any javascript libraries.
All styles for tables were used with bootstrap.css.

For creating the table such code is used:

```js
<div id="fullServerData"></div>
<script type="text/javascript">
  var container = document.getElementById('fullServerData');
  var grid = new SortableGrid(
     container,
     null,
     {
        'headers': ['1', '2', '3', '4', '5'],
        'maxRows': 5,
        'url': 'http://localhost:8001',
        'loadByParts': false,
        'withTemplates': false
     }
  );
</script>
```

##Installation

You can download the component table from the [github](https://github.com/neformal13/TeamvoyFrontend). For including
this component in your program, use this code:

```js
<script src="js/handlebars-v2.0.0.js" type="text/javascript"></script>
<script src="js/helper.js" type="text/javascript"></script>
<script src="js/event_machine.js" type="text/javascript"></script>
<script src="js/pager.js" type="text/javascript"></script>
<script src="js/sortable_grid.js" type="text/javascript"></script>
```

##Configure

Configure object consists of the next fields:

```js
<div id="fullDataWithTemplate"></div>
<script type="text/javascript">
var container = document.getElementById('fullDataWithTemplate');
var configObjectFullLoadingWithTemplate = {
  // {array} is used for columns header
  'headers': ['1', '2', '3', '4', '5'],
  // {number} count of rows on one page
  'maxRows': 5,
  // {string} the url to the local server
  'url': 'http://localhost:8001',
   // {boolean} whether the file will be load partial by pages or not
  'loadByParts': false,
  // {boolean} whether we use template in columns or not
  'withTemplates': true,
  // {object} if the table columns will be created with templates,
  //in this option use: index of column and function with template
  'columnTemplates': {
     1: Handlebars.compile("<i><b>{{age2}}</b></i>"),
     4: Handlebars.compile("<u>{{age5}}</u>")
   }
};
var fullDataTable = new SortableGrid(
  container,
  null,
  configObjectFullLoadingWithTemplate
);
</script>
```

###SortableGrid methods:

1. getCreatedElement() - Get all model of sortable grid
2. getRoot() - Get the table from sortable grid
3. getData() - Get data, that table consists
4. sort() - sort data in table
5. refresh() - put new data, container, configure object and change the table
6. renderTable() - generate table view
7. goTo() - go to the new page

##Usage

You can create the table with your array, such as:

```js
<div id="gridWithArray"></div>
<script type="text/javascript">
  var dataForTable = [
     ['Evkakiy', 'Ignatovych', 'OOP', '2', 'true'],
     ['Gnat', 'Kozlovskiy', 'Mathematic', '5', 'false'],
     ['Ivan', 'Miladze', 'Facepalm', '1', 'true'],
     ['Afanasiy', 'Bylba', 'Alchoball', '100', 'false'],
     ['Kerry', 'King', 'Guitar', '666', 'true']
  ];
  var container = document.getElementById("gridForTable");
  var configObject = {
     'headers': ['1', '2', '3', '4', '5'],
     'maxRows': 5,
     'withTemplates': false
  };
  var tableWithArray = new SortableGrid(
    container,
    dataForTable,
    configObject
  );
</script>
```

Also you can create the table with data from file:

```js
<div id="gridFromFile"></div>
<script type="text/javascript">
  var container = document.getElementById("gridFromFile");
  var configObject = {
     'headers': ['1', '2', '3', '4', '5'],
     'maxRows': 5,
     'url': 'http://localhost:8001',
     'loadByParts': false,
     'withTemplates': false
  };
  var tableWithFile = new SortableGrid(
    container,
    null,
    configObject
  );
</script>
```

##Additions

###Draggable table

For using this addition you have to include the next js file:

```js
<script src="js/draggable.js" type="text/javascript"></script>
```

For creating this table, you can use class Draggable, that have two arguments: table and data from this table.

You can create the draggable table with such code:

```js
<div id="fullServerData"></div>
<script type="text/javascript">
  var container = document.getElementById('fullServerData');
  var grid = new SortableGrid(
     container,
     null,
     {
        'headers': ['1', '2', '3', '4', '5'],
        'maxRows': 5,
        'url': 'http://localhost:8001',
        'loadByParts': false,
        'withTemplates': false
     }
  ).getCreatedElement();
  var draggable = new Draggable(
    grid.getRoot(),
    grid.getData()
  );
</script>
```

###Filterable table

For using this addition you have to include the next js file:

```js
<script src="js/filterable.js" type="text/javascript"></script>
```

You can you this additions with class Filterable, that have one argument: table, where we want to use it.
You can turn on filterable with method enable() and turn out with disable() method.

You can create table with filter with such code:

```js
<div id="fullServerData"></div>
<script type="text/javascript">
  var container = document.getElementById('fullServerData');
  var grid = new SortableGrid(
     container,
     null,
     {
        'headers': ['1', '2', '3', '4', '5'],
        'maxRows': 5,
        'url': 'http://localhost:8001',
        'loadByParts': false,
        'withTemplates': false
     }
  ).getCreatedElement();
  var filterable = new Filterable(grid.getRoot());
  filterable.enable(1);
</script>
```

##Examples

###Draggable table

<div id="draggable" class="table-responsive"></div>

###Table with filter

<div id="filterable" class="table-responsive"></div>

###Table with full data from server

<div id="fullServerData" class="table-responsive"></div>

###Table with full data from server with templates

<div id="withTemplate" class="table-responsive"></div>

###Table with partial data from server with templates

<div id="partialServerData" class="table-responsive"></div>

