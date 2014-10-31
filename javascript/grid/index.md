##Tables examples

All styles for tables were taken from bootstrap.css

Calling new SortableGrid(...).getCreateElement will return
        new SortableGrid with public methods, like: sort, getCreatedElement.

For creating this table such code is used:

```js
var table = new SortableGrid(container, array, config, maxRows).getCreatedElement();
```

Where:

    1. **Container** - the HTML tag where this table will be located. For example,
       > document.getElementById("container");