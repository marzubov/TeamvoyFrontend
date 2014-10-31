##Tables examples

All styles for tables were taken from bootstrap.css

Calling new SortableGrid(...).getCreateElement will return
        new SortableGrid with public methods, like: sort, getCreatedElement.

For creating this table such code is used:

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