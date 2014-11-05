##Component TABLE

Component Table is created without any javascript libraries.
All styles for tables were used with bootstrap.css.

For creating the table such code is used:

```js
  <div id="fullServerData"></div>
  <script type="text/javascript">
     var container = document.getElementById('fullServerData');
     new SortableGrid(
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
  </script>
```


```js
    var table = new SortableGrid(container, array, config, maxRows).getCreatedElement();
```

Where:

    1. Container - the HTML tag where this table will be located. For example,
       document.getElementById("container");

    2. Array - this array will be contained into table.
       If you want to load the data from file, this option = null

    3. Config is contained the next options:
        *  headers - the array of the head of each columns.
        *  maxRows - maximum count of rows on one page.
        *  url - urt to local server
        *  loadByParts (boolean) - whether the file will be load by part or not.
        *  withTemplates (boolean) - whether the columns will have the templates or not.
        *  columnsTemplate - if the table columns will be created with templates, in this option we
           point the object: index of column and function with template

###Draggable table

```js
    var draggableTable = new SortableGrid(
            container,
            numberArray,
            configObject,
        ).getCreatedElement();
```

Where:

```js
    var container = document.getElementById('draggable');
    var numberArray = Array.apply(null, {length: 100})
        .map(function () {
            return Array.apply(null, {length: 5})
                .map(function () {
                    return Math.floor(Math.random() * 1000);
            });
    });
    var configObject = {
        'headers': ['1', '2', '3', '4', '5'],
        'maxRows': 5,
        'withTemplates': false
    };
```

<div id="draggable" class="table-responsive">
</div>

###Table with filter

For creating table with filter, you have to create table with your data with class SortableGrid, and then allow the filterable with the class Filterable.
This class have one argument: the table, where we wand to use filterable.
If we want to show the input box, write filterable.enable(1);

```js
    var filteredTable = new SortableGrid(container, stringArray, configObject).getCreatedElement();
    var filterable = new Filterable(filteredTable.getRoot());
    filterable.enable(1);
```

Where:

```js
    var container = document.getElementById('filterable');
    var stringArray = [
            ['Evkakiy', 'Ignatovych', 'OOP', '2', 'true'],
            ['Gnat', 'Kozlovskiy', 'Mathematic', '5', 'false'],
            ['Ivan', 'Miladze', 'Facepalm', '1', 'true'],
            ['Afanasiy', 'Bylba', 'Alchoball', '100', 'false'],
            ['Kerry', 'King', 'Guitar', '666', 'true']
        ];
    var configObject = {
            'headers': ['1', '2', '3', '4', '5'],
            'maxRows': 5,
            'withTemplates': false
        };
```

<div id="filterable" class="table-responsive">
</div>

###Table with full data from server

For creating this table, we have to enter the url of local server in config, where data are located. Also enter null tho the option 'array'.
For example,

```js
    var fullDataTable = new SortableGrid(container, null, configObjectFullLoading).getCreatedElement();
```

Where:

```js
    var container = document.getElementById('fullServerData');
    var configObjectFullLoading = {
            'headers': ['1', '2', '3', '4', '5'],
            'maxRows': 5,
            'url': 'http://localhost:8001',
            'loadByParts': false,
            'withTemplates': false
        };
```

<div id="fullServerData" class="table-responsive">
</div>

###Table with full data from server with templates

For creating this table, we have to enter the url of local server in config, where data are located, enter null to the option 'array'.

Also we have to enter true to option 'withTemplate' and in 'columnTemplates' enter the columns, where we want to use the templates, and the templates that we want to use.
For example:

```js
    var fullDataTable = new SortableGrid(container, null, configObjectFullLoadingWithTemplate).getCreatedElement();
```

Where:

```js
    var container = document.getElementById('withTemplate');
    var configObjectFullLoadingWithTemplate = {
                'headers': ['1', '2', '3', '4', '5'],
                'maxRows': 5,
                'url': 'http://localhost:8001',
                'loadByParts': false,
                'withTemplates': true,
                'columnTemplates': {
                    1: Handlebars.compile("<i><b>{{age2}}</b></i>"),
                    4: Handlebars.compile("<u>{{age5}}</u>")
                }
            };
```

<div id="withTemplate" class="table-responsive">
</div>

###Table with partial data from server with templates

In this table data for every page loads only then we use that page.

For creating this table, we have to to enter the url of local server in config, where data are located, enter null to the option 'array'.

Also we have to enter true to the option 'loadByParts', and enter true to option 'withTemplate' and in 'columnTemplates' enter the columns, where we want to use the templates, and the templates that we want to use.
For example:

```js
    var partDataTable = new SortableGrid(container, null, configObjectPartialLoading).getCreatedElement();
```

Where:

```js
    var container = document.getElementById('partialServerData');
    var configObjectPartialLoading = {
            'headers': ['1', '2', '3', '4', '5'],
            'maxRows': 5,
            'url': 'http://localhost:8001',
            'loadByParts': true,
            'withTemplates': true,
            'columnTemplates': {
                1: Handlebars.compile("<b>{{age2}}</b>")
            }
        };
```

<div id="partialServerData" class="table-responsive">
    </div>

