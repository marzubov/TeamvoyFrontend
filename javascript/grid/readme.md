##SortableGrid.js

Component Table is created without any javascript libraries.
This class return the created table.

For creating the table such code is used:

```js
<div id="fullServerData"></div>
<script type="text/javascript">
  var container = document.getElementById('fullServerData');
  var grid = new SortableGrid(
     container,
     {
        'headers': ['1', '2', '3', '4', '5'],
        'maxRows': 5,
        'arrayOrURL': 'http://localhost:8001',
        'withFilter': false,
        'loadByParts': false,
        'columnTemplates': false
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
  // {string or array} the url to the local server
  //or the array with data for table
  'arrayOrURL': 'http://localhost:8001',
  //for including filter field to the table
  'withFilter': false,
   // {boolean} whether the file will be load partial by pages or not
  'loadByParts': false,
  // {object or boolean} if we don't use templates use {false}
  // if the table columns will be created with templates,
  // in this option use: index of column and function with template
  'columnTemplates': {
     1: Handlebars.compile("<i><b>{{age2}}</b></i>"),
     4: Handlebars.compile("<u>{{age5}}</u>")
   }
};
var fullDataTable = new SortableGrid(
  container,
  configObjectFullLoadingWithTemplate
);
</script>
```

###SortableGrid public methods:

1. changeTableData() - argument - newData. Refresh the table with new data.
2. goTo() - argument - index of page. Go to the new page

###SortableGrid public properties:
1. root - the created table
2. dataArray - the data, that is located in table.

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
     'arrayOrURL' : dataForTable,
     'withFilter': false,
     'maxRows': 5,
     'columnTemplates': false
  };
  var tableWithArray = new SortableGrid(
    container,
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
     'arrayOrURL': 'http://localhost:8001',
     'withFilter': false,
     'loadByParts': false,
     'columnTemplates': false
  };
  var tableWithFile = new SortableGrid(
    container,
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
     {
        'headers': ['1', '2', '3', '4', '5'],
        'maxRows': 5,
        'arrayOrURL': 'http://localhost:8001',
        'loadByParts': false,
        'columnTemplates': false
     }
  );
  var draggable = new Draggable(
    grid.root,
    grid.dataArray
  );
</script>
```

###Filterable table

For using this addition you have to include the next js file:

```js
<script src="js/filterable.js" type="text/javascript"></script>
```

You can use this additions with configuration element 'withFilter': true.

You can create table with filter with such code:

```js
<div id="fullServerData"></div>
<script type="text/javascript">
  var container = document.getElementById('fullServerData');
  var grid = new SortableGrid(
     container,
     {
        'headers': ['1', '2', '3', '4', '5'],
        'maxRows': 5,
        'arrayOrURL': 'http://localhost:8001',
        'withFilter': true,
        'loadByParts': false,
        'columnTemplates': false
     }
  );
</script>
```

##Examples

###Draggable table

<div id="draggable" class="table-responsive"></div>

###Table with full data from server with templates with filter

<div id="withTemplate" class="table-responsive"></div>

###Table with partial data from server with templates

<div id="partialServerData" class="table-responsive"></div>

